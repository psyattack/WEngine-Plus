#![windows_subsystem = "windows"]

use std::collections::HashMap;
use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::Arc;
use std::time::Instant;
use tokio::sync::RwLock;

use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Json};
use axum::routing::{get, post};
use axum::Router;
use serde::Deserialize;
use tower_http::cors::{Any, CorsLayer};

mod auth;
mod setup;
mod services;
mod steam;

use auth::accounts::{self, AccountsManager};
use auth::auth::AuthManager;
use services::download::DownloadManager;
use services::dotnet::DotnetManager;
use services::extract::ExtractManager;
use services::lifecycle::LifecycleManager;
use services::metadata::MetadataManager;
use services::plugins::PluginManager;
use steam::client::SteamClient;
use steam::parser;
use steam::types::{self, BrowseQuery};
use steam::url_builder;

#[derive(Clone)]
struct CachedBrowsePage {
    created_at: Instant,
    page: types::WorkshopPage,
}

#[derive(Clone)]
struct AppState {
    auth: Arc<AuthManager>,
    client: Arc<SteamClient>,
    lifecycle: Arc<LifecycleManager>,
    accounts: Arc<AccountsManager>,
    download: Arc<DownloadManager>,
    extract: Arc<ExtractManager>,
    plugins: Arc<PluginManager>,
    dotnet: Arc<DotnetManager>,
    qr_download: Arc<accounts::QrDownloadAuthManager>,
    metadata: Arc<MetadataManager>,
    browse_cache: Arc<RwLock<HashMap<String, CachedBrowsePage>>>,
    workshop_cache: Arc<RwLock<HashMap<String, types::WorkshopItem>>>,
    we_dir: PathBuf,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args: Vec<String> = std::env::args().collect();
    let has_daemon_flag = args.iter().any(|a| a == "--daemon" || a == "-d" || a == "/daemon");

    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));

    // Detect Wallpaper Engine directory and parent process
    let mut sys = sysinfo::System::new();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);

    let is_parent_we = sysinfo::get_current_pid().ok().and_then(|pid| {
        sys.process(pid).and_then(|p| p.parent()).and_then(|ppid| {
            sys.process(ppid).map(|pp| {
                let pname = pp.name().to_string_lossy().to_lowercase();
                pname.contains("wallpaper")
            })
        })
    }).unwrap_or(false);

    let is_daemon = has_daemon_flag || is_parent_we;

    if !is_daemon {
        let auto_confirm = args.iter().any(|a| a == "-y" || a == "--yes");
        setup::run_setup_mode(auto_confirm);
        return Ok(());
    }

    let running_we_dir = sys.processes().values().find_map(|p| {
        let name = p.name().to_string_lossy().to_lowercase();
        if name == "wallpaper64.exe" || name == "wallpaper32.exe" {
            p.exe().and_then(|e| e.parent().map(|d| d.to_path_buf()))
        } else {
            None
        }
    });

    let we_dir = running_we_dir
        .or_else(|| {
            exe_dir
                .parent()
                .and_then(|p| p.parent())
                .and_then(|p| p.parent())
                .map(|p| p.to_path_buf())
                .filter(|p| p.exists())
        })
        .unwrap_or_else(|| PathBuf::from(r"C:\Program Files\Wallpaper Engine"));

    // Plugins MUST be located in the same directory as scripts (ui/dist/scripts/plugins)
    let scripts_dir = if exe_dir.join("scripts.js").exists() {
        exe_dir.clone()
    } else if exe_dir.ends_with("scripts") {
        exe_dir.clone()
    } else if we_dir.join("ui").join("dist").join("scripts").exists() {
        we_dir.join("ui").join("dist").join("scripts")
    } else if PathBuf::from(r"C:\Program Files\Wallpaper Engine\ui\dist\scripts").exists() {
        PathBuf::from(r"C:\Program Files\Wallpaper Engine\ui\dist\scripts")
    } else {
        exe_dir.clone()
    };

    let plugins_dir = scripts_dir.join("plugins");
    let _ = std::fs::create_dir_all(&plugins_dir);

    let auth = Arc::new(AuthManager::new(&exe_dir));
    let client = Arc::new(SteamClient::new());
    let lifecycle = Arc::new(LifecycleManager::new());
    let accounts = Arc::new(AccountsManager::new(&exe_dir));
    let download = Arc::new(DownloadManager::new());
    let extract = Arc::new(ExtractManager::new());
    let dotnet = Arc::new(DotnetManager::new(scripts_dir.clone()));
    let plugins = Arc::new(PluginManager::new(plugins_dir, Arc::clone(&dotnet)));
    let qr_download = Arc::new(accounts::QrDownloadAuthManager::new());
    let metadata = Arc::new(MetadataManager::new(&scripts_dir));
    metadata.clean_uninstalled(&we_dir);
    let browse_cache = Arc::new(RwLock::new(HashMap::new()));
    let workshop_cache = Arc::new(RwLock::new(HashMap::new()));

    // Auto-login to system account if not logged in
    if !auth.get_status().logged_in {
        let auth_clone = Arc::clone(&auth);
        tokio::spawn(async move {
            let _ = auth_clone.login_system_account().await;
        });
    }

    let state = AppState {
        auth,
        client,
        lifecycle,
        accounts,
        download,
        extract,
        plugins,
        dotnet,
        qr_download,
        metadata,
        browse_cache,
        workshop_cache,
        we_dir,
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/ping", get(handle_ping))
        .route("/api/heartbeat", post(handle_heartbeat))
        .route("/api/shutdown", post(handle_shutdown))
        .route("/api/dialog/folder", get(handle_dialog_folder))
        .route("/api/auth/status", get(handle_auth_status))
        .route("/api/auth/qr/begin", post(handle_qr_begin))
        .route("/api/auth/qr/poll", post(handle_qr_poll))
        .route("/api/auth/cookie", post(handle_auth_cookie))
        .route("/api/auth/logout", post(handle_auth_logout))
        .route("/api/auth/login", post(handle_auth_login))
        .route("/api/steam/login/system", post(handle_steam_login_system))
        .route("/api/accounts/list", get(handle_accounts_list))
        .route("/api/accounts/select", post(handle_accounts_select))
        .route("/api/accounts/add", post(handle_accounts_add))
        .route("/api/accounts/remove", post(handle_accounts_remove))
        .route("/api/accounts/qr/start", post(handle_accounts_qr_start))
        .route("/api/accounts/qr/status", get(handle_accounts_qr_status))
        .route("/api/accounts/qr/cancel", post(handle_accounts_qr_cancel))
        .route("/api/plugins/status", get(handle_plugins_status))
        .route("/api/plugins/ensure", post(handle_plugins_ensure))
        .route("/api/dotnet/status", get(handle_dotnet_status))
        .route("/api/dotnet/ensure", post(handle_dotnet_ensure))
        .route("/api/metadata/all", get(handle_metadata_all))
        .route("/api/metadata/save", post(handle_metadata_save))
        .route("/api/metadata/delete", post(handle_metadata_delete))
        .route("/api/workshop/browse", get(handle_workshop_browse))
        .route("/api/workshop/item", get(handle_workshop_item))
        .route(
            "/api/workshop/download",
            post(handle_workshop_download),
        )
        .route("/api/workshop/download/all", get(handle_workshop_download_all))
        .route("/api/workshop/download/status", get(handle_workshop_download_status))
        .route("/api/workshop/download/cancel", post(handle_workshop_download_cancel))
        .route("/api/workshop/extract", post(handle_workshop_extract))
        .route("/api/workshop/extract/status", get(handle_workshop_extract_status))
        .route("/api/workshop/delete", post(handle_workshop_delete))
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 43196));
    let listener = tokio::net::TcpListener::bind(addr).await?;

    axum::serve(listener, app).await?;
    Ok(())
}

async fn handle_ping() -> &'static str {
    "pong"
}

async fn handle_heartbeat(State(state): State<AppState>) -> Json<serde_json::Value> {
    state.lifecycle.touch_heartbeat();
    Json(serde_json::json!({ "ok": true }))
}

async fn handle_shutdown() -> Json<serde_json::Value> {
    tokio::spawn(async {
        tokio::time::sleep(std::time::Duration::from_millis(200)).await;
        std::process::exit(0);
    });
    Json(serde_json::json!({ "ok": true }))
}

async fn handle_auth_status(State(state): State<AppState>) -> Json<serde_json::Value> {
    let status = state.auth.get_status();
    Json(serde_json::to_value(status).unwrap_or_default())
}

async fn handle_qr_begin(State(state): State<AppState>) -> impl IntoResponse {
    match state.auth.begin_qr().await {
        Ok(res) => (StatusCode::OK, Json(serde_json::to_value(res).unwrap_or_default())),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": e.to_string() })),
        ),
    }
}

#[derive(Deserialize)]
struct QrPollReq {
    client_id: String,
    request_id: String,
}

async fn handle_qr_poll(
    State(state): State<AppState>,
    Json(req): Json<QrPollReq>,
) -> Json<serde_json::Value> {
    let res = state.auth.poll_qr(&req.client_id, &req.request_id).await;
    Json(serde_json::to_value(res).unwrap_or_default())
}

#[derive(Deserialize)]
struct CookieLoginReq {
    steamid: String,
    steam_login_secure: String,
    persona_name: Option<String>,
}

async fn handle_auth_cookie(
    State(state): State<AppState>,
    Json(req): Json<CookieLoginReq>,
) -> Json<serde_json::Value> {
    match state.auth.set_cookie_session(req.steamid, req.steam_login_secure, req.persona_name) {
        Ok(status) => Json(serde_json::json!({ "ok": true, "session": status })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

async fn handle_auth_logout(State(state): State<AppState>) -> Json<serde_json::Value> {
    state.auth.logout();
    Json(serde_json::json!({ "ok": true }))
}

#[derive(Deserialize)]
struct CredentialsLoginReq {
    username: String,
    password: String,
}

async fn handle_auth_login(
    State(state): State<AppState>,
    Json(req): Json<CredentialsLoginReq>,
) -> Json<serde_json::Value> {
    match state.auth.login_credentials(&req.username, &req.password).await {
        Ok(status) => Json(serde_json::json!({ "ok": true, "status": status })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

// Download accounts handlers
async fn handle_accounts_list(State(state): State<AppState>) -> Json<serde_json::Value> {
    let data = state.accounts.list();
    Json(serde_json::to_value(data).unwrap_or_default())
}

#[derive(Deserialize)]
struct AccountSelectReq {
    index: usize,
}

async fn handle_accounts_select(
    State(state): State<AppState>,
    Json(req): Json<AccountSelectReq>,
) -> Json<serde_json::Value> {
    let ok = state.accounts.select(req.index);
    Json(serde_json::json!({ "ok": ok }))
}

#[derive(Deserialize)]
struct AccountAddReq {
    username: String,
    password: Option<String>,
}

async fn handle_accounts_add(
    State(state): State<AppState>,
    Json(req): Json<AccountAddReq>,
) -> Json<serde_json::Value> {
    let item = state.accounts.add_custom(req.username, req.password);
    Json(serde_json::json!({ "ok": true, "account": item }))
}

#[derive(Deserialize)]
struct AccountRemoveReq {
    username: String,
}

async fn handle_accounts_remove(
    State(state): State<AppState>,
    Json(req): Json<AccountRemoveReq>,
) -> Json<serde_json::Value> {
    let ok = state.accounts.remove_custom(&req.username);
    Json(serde_json::json!({ "ok": ok }))
}

// Plugin handlers
async fn handle_plugins_status(State(state): State<AppState>) -> Json<serde_json::Value> {
    let status = state.plugins.get_status();
    Json(serde_json::to_value(status).unwrap_or_default())
}

async fn handle_plugins_ensure(State(state): State<AppState>) -> Json<serde_json::Value> {
    state.plugins.start_ensure();
    Json(serde_json::json!({ "ok": true }))
}

// Dotnet handlers
async fn handle_dotnet_status(State(state): State<AppState>) -> Json<serde_json::Value> {
    let status = state.dotnet.get_status();
    Json(serde_json::to_value(status).unwrap_or_default())
}

async fn handle_dotnet_ensure(State(state): State<AppState>) -> Json<serde_json::Value> {
    state.dotnet.start_ensure();
    Json(serde_json::json!({ "ok": true }))
}

// Metadata handlers
async fn handle_metadata_all(State(state): State<AppState>) -> Json<serde_json::Value> {
    let all = state.metadata.get_all();
    Json(all)
}

#[derive(Deserialize)]
struct SaveMetadataReq {
    pubfileid: Option<String>,
    metadata: Option<serde_json::Value>,
    all: Option<serde_json::Map<String, serde_json::Value>>,
}

async fn handle_metadata_save(
    State(state): State<AppState>,
    Json(req): Json<SaveMetadataReq>,
) -> Json<serde_json::Value> {
    if let Some(all) = req.all {
        state.metadata.update_all(all);
    } else if let (Some(pid), Some(meta)) = (req.pubfileid, req.metadata) {
        state.metadata.set_item(&pid, meta);
    }
    Json(serde_json::json!({ "ok": true }))
}

#[derive(Deserialize)]
struct DeleteMetadataReq {
    pubfileid: String,
}

async fn handle_metadata_delete(
    State(state): State<AppState>,
    Json(req): Json<DeleteMetadataReq>,
) -> Json<serde_json::Value> {
    let pid = req.pubfileid.trim();
    let removed = if !pid.is_empty() {
        state.metadata.remove_item(pid)
    } else {
        false
    };
    Json(serde_json::json!({ "ok": true, "removed": removed }))
}

// Workshop browse & item details
fn make_browse_cache_key(query: &BrowseQuery) -> String {
    let is_author = query.itemid.as_ref().map_or(false, |s| !s.trim().is_empty());
    let q_per_page = query.get_num_per_page();
    let per_page = if q_per_page > 0 {
        if is_author && q_per_page == 50 { 30 } else { q_per_page }
    } else if is_author {
        30
    } else {
        50
    };
    format!(
        "p={}&n={}&s={}&t={}&rt={}&et={}&id={}&pr={}&inc={}&rf={}",
        query.page.max(1),
        per_page,
        query.sort.trim(),
        query.text.trim().to_lowercase(),
        query.required_tags.as_deref().unwrap_or(""),
        query.excluded_tags.as_deref().unwrap_or(""),
        query.itemid.as_deref().unwrap_or(""),
        query.preset.as_deref().unwrap_or(""),
        query.incompatible.unwrap_or(false),
        query.required_flags.as_deref().unwrap_or("")
    )
}

async fn fetch_browse_page(
    client: &SteamClient,
    auth: &AuthManager,
    query: &BrowseQuery,
) -> Result<types::WorkshopPage, anyhow::Error> {
    let url = url_builder::build_browse_url(query);
    let cookie_header = auth.get_cookie_header();
    let anon_cookies = "Steam_Language=english; mature_content=1; wants_mature_content=1; birthtime=283996801; lastagecheckage=1-0-1990; ";

    match client.fetch_html(&url, &cookie_header).await {
        Ok(html) => {
            let mut page = parser::parse_browse(&html, query.page, query.token);
            if page.wallpapers.is_empty() && !cookie_header.is_empty() {
                if let Ok(anon_html) = client.fetch_html(&url, anon_cookies).await {
                    let anon_page = parser::parse_browse(&anon_html, query.page, query.token);
                    if !anon_page.wallpapers.is_empty() {
                        page = anon_page;
                    }
                }
            }
            Ok(page)
        }
        Err(e) => {
            eprintln!("[Worker] Browse auth error: {e}, retrying anonymously...");
            match client.fetch_html(&url, anon_cookies).await {
                Ok(anon_html) => {
                    let page = parser::parse_browse(&anon_html, query.page, query.token);
                    Ok(page)
                }
                Err(e2) => Err(e2.into()),
            }
        }
    }
}

fn spawn_next_page_preload(state: AppState, query: BrowseQuery, pagecount: u32) {
    let current_page = query.page.max(1);
    if current_page >= pagecount {
        return;
    }
    let mut next_query = query;
    next_query.page = current_page + 1;
    let next_key = make_browse_cache_key(&next_query);

    tokio::spawn(async move {
        // Skip prefetch if already cached and fresh (< 300s)
        {
            let cache = state.browse_cache.read().await;
            if let Some(cached) = cache.get(&next_key) {
                if cached.created_at.elapsed().as_secs() < 300 {
                    return;
                }
            }
        }

        if let Ok(page) = fetch_browse_page(&state.client, &state.auth, &next_query).await {
            if !page.wallpapers.is_empty() {
                let mut cache = state.browse_cache.write().await;
                if cache.len() > 60 {
                    cache.retain(|_, v| v.created_at.elapsed().as_secs() < 300);
                }
                cache.insert(
                    next_key,
                    CachedBrowsePage {
                        created_at: Instant::now(),
                        page,
                    },
                );
            }
        }
    });
}

async fn handle_workshop_browse(
    State(state): State<AppState>,
    Query(query): Query<BrowseQuery>,
) -> impl IntoResponse {
    let cache_key = make_browse_cache_key(&query);

    // 1. Check cache for instant hit
    {
        let cache = state.browse_cache.read().await;
        if let Some(cached) = cache.get(&cache_key) {
            if cached.created_at.elapsed().as_secs() < 300 {
                let mut page = cached.page.clone();
                page.token = query.token;
                spawn_next_page_preload(state.clone(), query.clone(), page.pagecount);
                return (StatusCode::OK, Json(serde_json::to_value(page).unwrap_or_default()));
            }
        }
    }

    // 2. Fetch from Steam and parse
    match fetch_browse_page(&state.client, &state.auth, &query).await {
        Ok(page) => {
            // Save to in-memory workshop cache
            {
                let mut wcache = state.workshop_cache.write().await;
                if wcache.len() > 1000 {
                    wcache.clear();
                }
                for it in &page.wallpapers {
                    wcache.insert(it.workshopid.clone(), it.clone());
                }
            }

            // Save to cache
            {
                let mut cache = state.browse_cache.write().await;
                if cache.len() > 60 {
                    cache.retain(|_, v| v.created_at.elapsed().as_secs() < 300);
                }
                cache.insert(
                    cache_key,
                    CachedBrowsePage {
                        created_at: Instant::now(),
                        page: page.clone(),
                    },
                );
            }

            // Trigger background preload for next page
            spawn_next_page_preload(state.clone(), query.clone(), page.pagecount);

            (StatusCode::OK, Json(serde_json::to_value(page).unwrap_or_default()))
        }
        Err(e) => {
            eprintln!("[Worker] Browse error: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "action": "queryWorkshop",
                    "wallpapers": [],
                    "pagecount": 1,
                    "token": query.token,
                    "isbackup": true,
                    "error": e.to_string()
                })),
            )
        }
    }
}

#[derive(Deserialize)]
struct ItemQuery {
    id: String,
}

fn is_installed_on_disk(state: &AppState, id: &str) -> bool {
    let clean = id.trim();
    if clean.is_empty() {
        return false;
    }
    if state.we_dir.join("projects").join("myprojects").join(clean).exists() {
        return true;
    }
    if state.we_dir.join("projects").join("defaultprojects").join(clean).exists() {
        return true;
    }
    if state.we_dir.join("workshop").join("content").join("431960").join(clean).exists() {
        return true;
    }
    false
}

async fn handle_workshop_item(
    State(state): State<AppState>,
    Query(query): Query<ItemQuery>,
) -> impl IntoResponse {
    let clean_id = query.id.trim();
    if clean_id.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({ "error": "Missing item id" })),
        );
    }

    let url = format!("https://steamcommunity.com/sharedfiles/filedetails/?id={clean_id}");
    let cookie_header = state.auth.get_cookie_header();

    match state.client.fetch_html(&url, &cookie_header).await {
        Ok(html) => {
            let mut item = parser::parse_item_details(&html, clean_id);

            // Merge any missing fields from in-memory workshop_cache if available
            {
                let wcache = state.workshop_cache.read().await;
                if let Some(cached) = wcache.get(clean_id) {
                    if item.author.is_empty() && !cached.author.is_empty() {
                        item.author = cached.author.clone();
                    }
                    if item.author_avatar.is_empty() && !cached.author_avatar.is_empty() {
                        item.author_avatar = cached.author_avatar.clone();
                    }
                    if item.authorsteamid.is_empty() && !cached.authorsteamid.is_empty() {
                        item.authorsteamid = cached.authorsteamid.clone();
                    }
                    if item.author_url.is_empty() && !cached.author_url.is_empty() {
                        item.author_url = cached.author_url.clone();
                    }
                    if !item.rating_star_file.contains("not-enough-ratings") && item.ratingrounded == 0 && cached.ratingrounded > 0 {
                        item.ratingrounded = cached.ratingrounded;
                        item.rating = cached.rating;
                        item.hasrating = cached.hasrating;
                    }
                }
            }

            // Save in in-memory workshop_cache
            {
                let mut wcache = state.workshop_cache.write().await;
                wcache.insert(clean_id.to_string(), item.clone());
            }

            let should_persist = is_installed_on_disk(&state, clean_id);
            if should_persist {
                if let Ok(v) = serde_json::to_value(&item) {
                    state.metadata.set_item(clean_id, v);
                }
            }
            (StatusCode::OK, Json(serde_json::to_value(item).unwrap_or_default()))
        }
        Err(e) => {
            // 1. Fallback to in-memory workshop_cache
            {
                let wcache = state.workshop_cache.read().await;
                if let Some(cached) = wcache.get(clean_id) {
                    return (StatusCode::OK, Json(serde_json::to_value(cached).unwrap_or_default()));
                }
            }
            // 2. Fallback to disk metadata
            if let Some(cached) = state.metadata.get_item(clean_id) {
                return (StatusCode::OK, Json(cached));
            }
            eprintln!("[Worker] Item details error for {clean_id}: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": e.to_string() })),
            )
        }
    }
}

#[derive(Deserialize)]
struct DownloadReq {
    pubfileid: String,
}

async fn handle_workshop_download(
    State(state): State<AppState>,
    Json(req): Json<DownloadReq>,
) -> Json<serde_json::Value> {
    let depot_bin = match state.plugins.get_plugin_path("DepotDownloaderMod") {
        Some(p) => p,
        None => {
            state.plugins.start_ensure();
            return Json(serde_json::json!({
                "ok": false,
                "error": "DepotDownloaderMod is downloading. Please wait."
            }));
        }
    };

    match state.download.start(
        req.pubfileid.clone(),
        Arc::clone(&state.accounts),
        state.we_dir.clone(),
        depot_bin,
        state.dotnet.get_dotnet_root(),
    ).await {
        Ok(_) => Json(serde_json::json!({ "ok": true, "pubfileid": req.pubfileid })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

async fn handle_workshop_download_all(State(state): State<AppState>) -> Json<serde_json::Value> {
    let list = state.download.list();
    Json(serde_json::to_value(list).unwrap_or_default())
}

#[derive(Deserialize)]
struct TaskStatusQuery {
    pubfileid: String,
}

async fn handle_workshop_download_status(
    State(state): State<AppState>,
    Query(q): Query<TaskStatusQuery>,
) -> Json<serde_json::Value> {
    let res = state.download.get(&q.pubfileid);
    Json(serde_json::to_value(res).unwrap_or(serde_json::Value::Null))
}

#[derive(Deserialize)]
struct CancelReq {
    pubfileid: String,
}

async fn handle_workshop_download_cancel(
    State(state): State<AppState>,
    Json(req): Json<CancelReq>,
) -> Json<serde_json::Value> {
    let ok = state.download.cancel(&req.pubfileid, &state.we_dir).await;
    Json(serde_json::json!({ "ok": ok, "pubfileid": req.pubfileid }))
}

#[derive(Deserialize)]
struct ExtractReq {
    pubfileid: Option<String>,
    file: Option<String>,
    output_dir: Option<String>,
}

async fn handle_workshop_extract(
    State(state): State<AppState>,
    Json(req): Json<ExtractReq>,
) -> Json<serde_json::Value> {
    let repkg_bin = match state.plugins.get_plugin_path("RePKG") {
        Some(p) => p,
        None => {
            state.plugins.start_ensure();
            return Json(serde_json::json!({
                "ok": false,
                "error": "RePKG is downloading. Please wait."
            }));
        }
    };

    let mut target_pid = req.pubfileid.clone().unwrap_or_default().trim().to_string();
    if target_pid.is_empty() {
        if let Some(ref f) = req.file {
            let re = regex::Regex::new(r#"(?:myprojects|workshop)[/\\](\d+)"#).unwrap();
            if let Some(caps) = re.captures(f) {
                if let Some(m) = caps.get(1) {
                    target_pid = m.as_str().to_string();
                }
            }
        }
    }

    let file_path = req.file.map(PathBuf::from);
    let output_dir = req.output_dir.map(PathBuf::from);

    match state.extract.start(
        target_pid.clone(),
        file_path,
        output_dir,
        state.we_dir.clone(),
        repkg_bin,
        state.dotnet.get_dotnet_root(),
    ).await {
        Ok(_) => Json(serde_json::json!({ "ok": true, "pubfileid": target_pid })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

async fn handle_workshop_extract_status(
    State(state): State<AppState>,
    Query(q): Query<TaskStatusQuery>,
) -> Json<serde_json::Value> {
    let res = state.extract.get(&q.pubfileid);
    Json(serde_json::to_value(res).unwrap_or(serde_json::Value::Null))
}

#[derive(Deserialize)]
struct DeleteWallpaperReq {
    pubfileid: Option<String>,
    file: Option<String>,
}

fn clean_readonly_and_remove(p: &std::path::Path) {
    if !p.exists() {
        return;
    }
    if p.is_dir() {
        if let Ok(entries) = std::fs::read_dir(p) {
            for entry in entries.flatten() {
                clean_readonly_and_remove(&entry.path());
            }
        }
    }
    if let Ok(meta) = std::fs::symlink_metadata(p) {
        let mut perms = meta.permissions();
        if perms.readonly() {
            perms.set_readonly(false);
            let _ = std::fs::set_permissions(p, perms);
        }
    }
    if p.is_dir() {
        let _ = std::fs::remove_dir(p);
    } else {
        let _ = std::fs::remove_file(p);
    }
}

async fn robust_remove_dir(p: &std::path::Path) -> bool {
    if !p.exists() {
        return true;
    }
    for _ in 0..6 {
        clean_readonly_and_remove(p);
        if !p.exists() {
            return true;
        }
        tokio::time::sleep(tokio::time::Duration::from_millis(150)).await;
    }
    !p.exists()
}

async fn handle_workshop_delete(
    State(state): State<AppState>,
    Json(req): Json<DeleteWallpaperReq>,
) -> Json<serde_json::Value> {
    let mut deleted = false;
    let mut target_pid = req.pubfileid.clone().unwrap_or_default().trim().to_string();

    if target_pid.is_empty() {
        if let Some(ref f) = req.file {
            let re = regex::Regex::new(r#"(?:myprojects|workshop)[/\\](\d+)"#).unwrap();
            if let Some(caps) = re.captures(f) {
                if let Some(m) = caps.get(1) {
                    target_pid = m.as_str().to_string();
                }
            }
        }
    }

    if let Some(ref file_path) = req.file {
        let p = std::path::Path::new(file_path);
        let abs_p = if p.is_absolute() {
            p.to_path_buf()
        } else {
            state.we_dir.join(p)
        };
        let dir = if abs_p.is_file() { abs_p.parent() } else { Some(abs_p.as_path()) };
        if let Some(d) = dir {
            if d.exists() && (d.join("project.json").exists() || d.join("preview.jpg").exists() || d.join("preview.gif").exists() || !target_pid.is_empty()) {
                if robust_remove_dir(d).await {
                    deleted = true;
                }
            }
        }
    }

    if !target_pid.is_empty() {
        let myproj = state.we_dir.join("projects").join("myprojects").join(&target_pid);
        if myproj.exists() {
            if robust_remove_dir(&myproj).await {
                deleted = true;
            }
        }
        state.download.clear(&target_pid);
        state.extract.clear(&target_pid);
        state.metadata.remove_item(&target_pid);
    }

    Json(serde_json::json!({ "ok": true, "deleted": deleted, "pubfileid": target_pid }))
}

async fn handle_accounts_qr_start(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let depot_exe = match state.plugins.get_plugin_path("DepotDownloaderMod") {
        Some(p) => p,
        None => {
            state.plugins.start_ensure();
            return Json(serde_json::json!({
                "ok": false,
                "error": "DepotDownloaderMod is downloading. Please wait."
            }));
        }
    };
    match state.qr_download.start(depot_exe, Arc::clone(&state.accounts), state.dotnet.get_dotnet_root()).await {
        Ok(_) => Json(serde_json::json!({ "ok": true })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

async fn handle_accounts_qr_status(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let s = state.qr_download.get_status();
    Json(serde_json::to_value(s).unwrap_or_default())
}

async fn handle_accounts_qr_cancel(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    state.qr_download.cancel().await;
    Json(serde_json::json!({ "ok": true }))
}

async fn handle_steam_login_system(State(state): State<AppState>) -> Json<serde_json::Value> {
    match state.auth.login_system_account().await {
        Ok(status) => Json(serde_json::json!({ "ok": true, "status": status })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

async fn handle_dialog_folder() -> Json<serde_json::Value> {
    let result = tokio::task::spawn_blocking(|| {
        let ps_script = r#"
            [System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null
            $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
            $dialog.Description = 'Select extraction folder'
            $dialog.ShowNewFolderButton = $true
            if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
                [Console]::Out.Write($dialog.SelectedPath)
            }
        "#;
        let mut cmd = std::process::Command::new("powershell");
        cmd.args(["-NoProfile", "-STA", "-Command", ps_script]);
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            cmd.creation_flags(CREATE_NO_WINDOW);
        }
        match cmd.output() {
            Ok(out) => {
                let path = String::from_utf8_lossy(&out.stdout).trim().to_string();
                if path.is_empty() {
                    None
                } else {
                    Some(path)
                }
            }
            Err(_) => None,
        }
    })
    .await
    .unwrap_or(None);

    match result {
        Some(path) => Json(serde_json::json!({ "ok": true, "path": path })),
        None => Json(serde_json::json!({ "ok": false, "cancelled": true })),
    }
}

