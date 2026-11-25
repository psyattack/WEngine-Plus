//! Guards for the localhost HTTP API.
//!
//! The daemon only ever serves the Wallpaper Engine UI (CEF, served through its
//! own `http://wpx.internal` scheme) and local tooling, so everything else must
//! be rejected before a handler runs:
//!
//! * browsers send an `Origin` header on cross-site requests - a foreign origin
//!   is answered with `403` (CORS alone would still let state-changing "simple"
//!   requests through);
//! * the UI marks every helper call with [`CLIENT_HEADER`], which cross-site
//!   HTML forms, `<img>` tags and navigations cannot set at all;
//! * file system targets coming from the frontend are canonicalized and must
//!   stay inside the Wallpaper Engine directory.

use std::path::{Path, PathBuf};

use axum::extract::{Extension, Request};
use axum::http::header::{HeaderName, CONTENT_TYPE, ORIGIN};
use axum::http::{Method, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use tower_http::cors::{AllowOrigin, CorsLayer};

/// Header added by the patched frontend to every helper request.
pub const CLIENT_HEADER: &str = "x-wengine-client";

/// Steam application id of Wallpaper Engine.
pub const WE_APP_ID: &str = "431960";

/// Value shipped in the repository frontend. The installer replaces it with a
/// random per-install token; a plain constant would be forgeable by any page.
pub const TOKEN_PLACEHOLDER: &str = "__WEP_TOKEN__";

/// Marker the daemon looks for in the installed `scripts.js`.
const TOKEN_MARKER: &str = "WEP_API_TOKEN = \"";

/// Shared secret for the local API. It is injected into the installed
/// `scripts.js` by the installer, so a random page cannot learn it - unlike a
/// static header value, which a sandboxed iframe with `Origin: null` can forge.
#[derive(Clone, Debug)]
pub struct ApiToken(pub String);

/// CORS policy for the API: only the trusted origins get read access, and only
/// the headers/methods the UI actually uses.
pub fn cors_layer() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(AllowOrigin::predicate(|origin, _parts| {
            origin.to_str().map(is_trusted_origin).unwrap_or(false)
        }))
        .allow_methods([Method::GET, Method::POST])
        .allow_headers([CONTENT_TYPE, HeaderName::from_static(CLIENT_HEADER)])
}

/// Requests that bypass the token check: `/api/ping` is used by the
/// single-instance probe (and by whoever starts the daemon).
fn skips_client_header(path: &str) -> bool {
    path == "/api/ping"
}

/// Token characters and length produced by the installer (48 lowercase hex
/// characters); the lower bound rejects the placeholder.
pub fn is_valid_token(token: &str) -> bool {
    (32..=128).contains(&token.len()) && token.bytes().all(|b| b.is_ascii_hexdigit())
}

/// Reads the token the installer injected into the shipped frontend.
pub fn extract_token(scripts: &str) -> Option<String> {
    let start = scripts.find(TOKEN_MARKER)? + TOKEN_MARKER.len();
    let rest = &scripts[start..];
    let end = rest.find('"')?;
    let token = &rest[..end];
    is_valid_token(token).then(|| token.to_string())
}

/// Token used by the running daemon. The installed frontend wins (that is what
/// the UI sends; the token may live in either the base or the overlay file),
/// then the token file, then the development placeholder.
pub fn load_token(data_dir: &Path) -> String {
    for file in ["scripts.js", "wengine-plus.js"] {
        if let Ok(scripts) = std::fs::read_to_string(data_dir.join(file)) {
            if let Some(token) = extract_token(&scripts) {
                return token;
            }
        }
    }
    if let Ok(raw) = std::fs::read_to_string(data_dir.join("wengine-token")) {
        let token = raw.trim();
        if is_valid_token(token) {
            return token.to_string();
        }
    }
    TOKEN_PLACEHOLDER.to_string()
}

fn token_matches(expected: &str, provided: &str) -> bool {
    let expected = expected.as_bytes();
    let provided = provided.as_bytes();
    if expected.len() != provided.len() {
        return false;
    }
    let mut diff = 0u8;
    for (a, b) in expected.iter().zip(provided) {
        diff |= a ^ b;
    }
    diff == 0
}

/// Wallpaper Engine's CEF UI is served through its own `http://wpx.internal`
/// scheme (not `file://`), so that exact origin must be trusted as well.
const WE_UI_ORIGIN: &str = "http://wpx.internal";

/// Origins allowed to call the API: the CEF UI loaded from disk and pages
/// served from loopback (dev servers, tooling).
pub fn is_trusted_origin(origin: &str) -> bool {
    let origin = origin.trim();
    if origin.eq_ignore_ascii_case("null")
        || origin.eq_ignore_ascii_case(WE_UI_ORIGIN)
        || origin.starts_with("file://")
    {
        return true;
    }

    let rest = match origin
        .strip_prefix("http://")
        .or_else(|| origin.strip_prefix("https://"))
    {
        Some(rest) => rest,
        None => return false,
    };

    let authority = rest.split('/').next().unwrap_or_default();
    let authority = authority.rsplit('@').next().unwrap_or(authority);
    let host = match authority.find(']') {
        Some(end) => {
            // `[::1]extra` must not be treated as a loopback origin.
            let tail = &authority[end + 1..];
            if !tail.is_empty() && !tail.starts_with(':') {
                return false;
            }
            &authority[..=end]
        }
        None => authority.split(':').next().unwrap_or_default(),
    };

    host.eq_ignore_ascii_case("localhost")
        || host == "127.0.0.1"
        || host.eq_ignore_ascii_case("[::1]")
}

pub async fn guard_request(
    Extension(ApiToken(expected)): Extension<ApiToken>,
    req: Request,
    next: Next,
) -> Response {
    if let Some(origin) = req.headers().get(ORIGIN) {
        let allowed = origin.to_str().map(is_trusted_origin).unwrap_or(false);
        if !allowed {
            return (StatusCode::FORBIDDEN, "Forbidden origin").into_response();
        }
    }

    if !skips_client_header(req.uri().path()) {
        let provided = req
            .headers()
            .get(CLIENT_HEADER)
            .and_then(|value| value.to_str().ok());
        let matches = provided
            .map(|value| token_matches(&expected, value))
            .unwrap_or(false);
        if !matches {
            return (StatusCode::FORBIDDEN, "Missing or invalid client token").into_response();
        }
    }

    next.run(req).await
}

/// Steam published-file ids are decimal and at most 20 digits long. Anything
/// else (`..`, absolute paths, junk) must never reach the file system.
pub fn sanitize_pubfileid(raw: &str) -> Option<String> {
    let value = raw.trim();
    if value.is_empty() || value.len() > 20 || !value.chars().all(|c| c.is_ascii_digit()) {
        return None;
    }
    Some(value.to_string())
}

/// Resolves `requested` against `base` and returns the canonical path when it
/// is a strict descendant of `base`.
pub fn resolve_inside_base(base: &Path, requested: &Path) -> Option<PathBuf> {
    let base = base.canonicalize().ok()?;
    let candidate = if requested.is_absolute() {
        requested.to_path_buf()
    } else {
        base.join(requested)
    };
    let canonical = candidate.canonicalize().ok()?;
    if canonical == base || !canonical.starts_with(&base) {
        return None;
    }
    Some(canonical)
}

/// Known on-disk locations of a wallpaper id.
pub fn wallpaper_dirs(we_dir: &Path, pubfileid: &str) -> Vec<PathBuf> {
    let mut paths = vec![
        we_dir.join("projects").join("myprojects").join(pubfileid),
        we_dir.join("projects").join("defaultprojects").join(pubfileid),
        we_dir.join("workshop").join(pubfileid),
        we_dir
            .join("workshop")
            .join("content")
            .join(WE_APP_ID)
            .join(pubfileid),
    ];
    if let Some(steam_root) = steam_workshop_root(we_dir) {
        paths.push(steam_root.join(pubfileid));
    }
    paths
}

/// True when the wallpaper directory still exists in one of the known roots.
pub fn is_installed_wallpaper(we_dir: &Path, pubfileid: &str) -> bool {
    wallpaper_dirs(we_dir, pubfileid)
        .iter()
        .any(|path| path.exists())
}

/// `<library>/steamapps/workshop/content/431960` for Steam installations.
pub fn steam_workshop_root(we_dir: &Path) -> Option<PathBuf> {
    let base = we_dir.canonicalize().ok()?;
    base.ancestors()
        .find(|ancestor| {
            ancestor
                .file_name()
                .and_then(|name| name.to_str())
                .is_some_and(|name| name.eq_ignore_ascii_case("steamapps"))
        })
        .map(|steamapps| steamapps.join("workshop").join("content").join(WE_APP_ID))
}

/// Canonical container folders whose direct children may be wallpapers.
fn canonical_roots(we_dir: &Path) -> Vec<PathBuf> {
    let mut roots = vec![
        we_dir.join("projects").join("myprojects"),
        we_dir.join("projects").join("defaultprojects"),
        // Installed content lives either in `<WE>\workshop\<id>` or in Steam's
        // `steamapps\workshop\content\431960\<id>`.
        we_dir.join("workshop"),
        we_dir.join("workshop").join("content").join(WE_APP_ID),
    ];
    if let Some(steam_root) = steam_workshop_root(we_dir) {
        roots.push(steam_root);
    }
    roots
        .into_iter()
        .filter_map(|root| root.canonicalize().ok())
        .collect()
}

/// Resolves an existing path the daemon may read (extract/delete targets):
/// inside the Wallpaper Engine directory or inside one of its workshop roots.
pub fn resolve_readable_target(we_dir: &Path, requested: &Path) -> Option<PathBuf> {
    if let Some(path) = resolve_inside_base(we_dir, requested) {
        return Some(path);
    }
    let base = we_dir.canonicalize().ok()?;
    let candidate = if requested.is_absolute() {
        requested.to_path_buf()
    } else {
        base.join(requested)
    };
    let canonical = candidate.canonicalize().ok()?;
    canonical_roots(we_dir)
        .iter()
        .any(|root| canonical.starts_with(root))
        .then_some(canonical)
}

/// Resolves a wallpaper path coming from the frontend into the directory that
/// may be deleted. Only direct children of the known container folders are
/// accepted, so a crafted request can never wipe a whole library.
pub fn resolve_wallpaper_target(we_dir: &Path, requested: &Path) -> Option<PathBuf> {
    let base = we_dir.canonicalize().ok()?;
    let candidate = if requested.is_absolute() {
        requested.to_path_buf()
    } else {
        base.join(requested)
    };
    let canonical = candidate.canonicalize().ok()?;
    let dir = if canonical.is_file() {
        canonical.parent()?.to_path_buf()
    } else {
        canonical
    };

    let parent = dir.parent()?;
    canonical_roots(we_dir)
        .iter()
        .any(|root| root == parent)
        .then_some(dir)
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request as HttpRequest;
    use axum::routing::{get, post};
    use axum::Router;
    use std::fs;
    use std::time::{SystemTime, UNIX_EPOCH};
    use tower::ServiceExt;

    const TEST_TOKEN: &str = "0123456789abcdef0123456789abcdef";

    fn temp_dir(tag: &str) -> PathBuf {
        let nanos = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_nanos())
            .unwrap_or_default();
        let dir = std::env::temp_dir().join(format!("wep-{tag}-{}-{nanos}", std::process::id()));
        fs::create_dir_all(&dir).expect("create temp dir");
        dir
    }

    #[test]
    fn accepts_ui_and_loopback_origins() {
        for origin in [
            "null",
            "http://wpx.internal",
            "file://",
            "file:///C:/Program%20Files/Wallpaper%20Engine/ui/dist/index.html",
            "http://127.0.0.1:43196",
            "http://localhost:3000",
            "https://LOCALHOST:8443",
            "http://[::1]:5173",
        ] {
            assert!(is_trusted_origin(origin), "origin should be trusted: {origin}");
        }
    }

    #[test]
    fn rejects_remote_origins() {
        for origin in [
            "https://evil.example",
            "http://127.0.0.1.evil.example",
            "https://localhost.evil.example",
            "http://evil.example/localhost",
            "http://[::1]evil",
            "http://[::1]localhost",
            "https://wpx.internal",
            "http://wpx.internal.evil.example",
            "http://evil.example/wpx.internal",
            "chrome-extension://abcdefghijklmnop",
            "ftp://127.0.0.1",
            "",
        ] {
            assert!(!is_trusted_origin(origin), "origin should be rejected: {origin}");
        }
    }

    #[test]
    fn sanitizes_pubfileid() {        assert_eq!(sanitize_pubfileid(" 1234567890 "), Some("1234567890".to_string()));
        assert_eq!(sanitize_pubfileid(""), None);
        assert_eq!(sanitize_pubfileid("12a45"), None);
        assert_eq!(sanitize_pubfileid("../431960"), None);
        assert_eq!(sanitize_pubfileid(&"9".repeat(21)), None);
    }

    #[test]
    fn wallpaper_dirs_cover_known_layouts() {
        let base = temp_dir("dirs");
        let dirs: Vec<String> = wallpaper_dirs(&base, "123")
            .iter()
            .map(|path| path.to_string_lossy().replace('\\', "/"))
            .collect();
        for expected in [
            "projects/myprojects/123",
            "projects/defaultprojects/123",
            "workshop/123",
            "workshop/content/431960/123",
        ] {
            assert!(
                dirs.iter().any(|path| path.ends_with(expected)),
                "missing candidate {expected} in {dirs:?}"
            );
        }
        fs::remove_dir_all(&base).ok();
    }

    #[test]
    fn keeps_paths_inside_we_dir() {
        let base = temp_dir("paths");
        fs::create_dir_all(base.join("projects/myprojects/123")).unwrap();
        fs::create_dir_all(base.join("workshop/555")).unwrap();
        fs::create_dir_all(base.join("workshop/content/431960")).unwrap();
        fs::write(base.join("projects/myprojects/123/project.json"), "{}").unwrap();
        fs::write(base.join("workshop/555/project.json"), "{}").unwrap();
        let outside = base.parent().unwrap().join("wep-outside.txt");
        fs::write(&outside, "x").unwrap();

        let item = base.join("projects/myprojects/123");
        let expected = item.canonicalize().unwrap();
        let workshop_item = base.join("workshop/555");

        assert_eq!(
            resolve_wallpaper_target(&base, &item.join("project.json")),
            Some(expected.clone())
        );
        assert_eq!(resolve_wallpaper_target(&base, &item), Some(expected));
        assert_eq!(
            resolve_wallpaper_target(&base, &workshop_item),
            Some(workshop_item.canonicalize().unwrap())
        );
        assert_eq!(resolve_wallpaper_target(&base, &base.join("projects/myprojects")), None);
        assert_eq!(
            resolve_wallpaper_target(&base, &base.join("workshop/content/431960")),
            None
        );
        assert_eq!(resolve_wallpaper_target(&base, &base.join("workshop")), None);
        assert_eq!(resolve_wallpaper_target(&base, &outside), None);
        assert_eq!(resolve_wallpaper_target(&base, &base.join("missing")), None);

        fs::remove_dir_all(&base).ok();
        fs::remove_file(&outside).ok();
    }

    #[test]
    fn accepts_steam_workshop_items() {
        let library = temp_dir("steamlib");
        let we_dir = library.join("steamapps/common/wallpaper_engine");
        let item = library.join("steamapps/workshop/content/431960/777");
        fs::create_dir_all(&we_dir).unwrap();
        fs::create_dir_all(&item).unwrap();
        fs::write(item.join("project.json"), "{}").unwrap();

        let expected = item.canonicalize().unwrap();
        assert_eq!(resolve_wallpaper_target(&we_dir, &item), Some(expected.clone()));
        assert_eq!(
            resolve_readable_target(&we_dir, &item.join("project.json")),
            Some(item.join("project.json").canonicalize().unwrap())
        );
        // The workshop library root itself is not a wallpaper.
        assert_eq!(
            resolve_wallpaper_target(&we_dir, &library.join("steamapps/workshop/content/431960")),
            None
        );

        fs::remove_dir_all(&library).ok();
    }

    fn test_app() -> Router {
        Router::new()
            .route("/api/ping", get(|| async { "pong" }))
            .route("/api/state", post(|| async { "ok" }))
            .route("/api/read", get(|| async { "ok" }))
            .layer(axum::middleware::from_fn(guard_request))
            .layer(axum::Extension(ApiToken(TEST_TOKEN.to_string())))
    }

    async fn call_status(app: Router, build: impl FnOnce(axum::http::request::Builder) -> axum::http::request::Builder) -> StatusCode {
        let req = build(HttpRequest::builder()).body(Body::empty()).unwrap();
        app.oneshot(req).await.unwrap().status()
    }

    #[tokio::test]
    async fn middleware_blocks_foreign_origin() {
        let code = call_status(test_app(), |b| {
            b.method("GET").uri("/api/ping").header(ORIGIN, "https://evil.example")
        })
        .await;
        assert_eq!(code, StatusCode::FORBIDDEN);
    }

    #[tokio::test]
    async fn middleware_requires_client_header() {
        let code = call_status(test_app(), |b| {
            b.method("GET").uri("/api/read").header(ORIGIN, "null")
        })
        .await;
        assert_eq!(code, StatusCode::FORBIDDEN);

        let code = call_status(test_app(), |b| {
            b.method("POST").uri("/api/state").header(ORIGIN, "null")
        })
        .await;
        assert_eq!(code, StatusCode::FORBIDDEN);
    }

    #[tokio::test]
    async fn middleware_allows_ui_calls() {
        let code = call_status(test_app(), |b| {
            b.method("GET")
                .uri("/api/read")
                .header(ORIGIN, "null")
                .header(CLIENT_HEADER, TEST_TOKEN)
        })
        .await;
        assert_eq!(code, StatusCode::OK);

        let code = call_status(test_app(), |b| {
            b.method("POST")
                .uri("/api/state")
                .header(ORIGIN, "http://127.0.0.1:43196")
                .header(CLIENT_HEADER, TEST_TOKEN)
        })
        .await;
        assert_eq!(code, StatusCode::OK);

        // The Wallpaper Engine CEF UI is served through its own scheme.
        let code = call_status(test_app(), |b| {
            b.method("GET")
                .uri("/api/read")
                .header(ORIGIN, "http://wpx.internal")
                .header(CLIENT_HEADER, TEST_TOKEN)
        })
        .await;
        assert_eq!(code, StatusCode::OK);
    }

    #[tokio::test]
    async fn cors_preflight_allows_wallpaper_engine_ui_origin() {
        let app = Router::new()
            .route("/api/state", post(|| async { "ok" }))
            .layer(axum::middleware::from_fn(guard_request))
            .layer(axum::Extension(ApiToken(TEST_TOKEN.to_string())))
            .layer(cors_layer());
        let req = HttpRequest::builder()
            .method("OPTIONS")
            .uri("/api/state")
            .header(ORIGIN, "http://wpx.internal")
            .header("access-control-request-method", "POST")
            .header(
                "access-control-request-headers",
                "content-type,x-wengine-client",
            )
            .body(Body::empty())
            .unwrap();
        let response = app.oneshot(req).await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            response
                .headers()
                .get("access-control-allow-origin")
                .and_then(|value| value.to_str().ok()),
            Some("http://wpx.internal")
        );
    }

    #[tokio::test]
    async fn middleware_exempts_ping() {
        let code = call_status(test_app(), |b| b.method("GET").uri("/api/ping")).await;
        assert_eq!(code, StatusCode::OK);
    }

    #[tokio::test]
    async fn middleware_rejects_wrong_token() {
        let code = call_status(test_app(), |b| {
            b.method("GET")
                .uri("/api/read")
                .header(ORIGIN, "null")
                .header(CLIENT_HEADER, "not-the-token")
        })
        .await;
        assert_eq!(code, StatusCode::FORBIDDEN);
    }

    #[test]
    fn extracts_only_installer_tokens() {
        let scripts = r#"(window.WEP_API_TOKEN = "0123456789abcdef0123456789abcdef"),"#;
        assert_eq!(
            extract_token(scripts).as_deref(),
            Some("0123456789abcdef0123456789abcdef")
        );
        assert!(is_valid_token("0123456789abcdef0123456789abcdef"));
        assert!(!is_valid_token(TOKEN_PLACEHOLDER));
        assert!(!is_valid_token("0123456789abcdef"));
        assert!(extract_token("(function () {})();").is_none());
        assert!(extract_token(r#"WEP_API_TOKEN = "short""#).is_none());
    }

    #[test]
    fn loads_token_from_frontend_or_file() {
        let base = temp_dir("token");
        assert_eq!(load_token(&base), TOKEN_PLACEHOLDER);

        fs::write(
            base.join("wengine-token"),
            "fedcba9876543210fedcba9876543210",
        )
        .unwrap();
        assert_eq!(load_token(&base), "fedcba9876543210fedcba9876543210");

        fs::write(
            base.join("scripts.js"),
            r#"(window.WEP_API_TOKEN = "0123456789abcdef0123456789abcdef"),"#,
        )
        .unwrap();
        assert_eq!(load_token(&base), "0123456789abcdef0123456789abcdef");

        // The overlay is the second place the token may live in.
        fs::write(base.join("scripts.js"), "no token here").unwrap();
        fs::write(
            base.join("wengine-plus.js"),
            r#"(window.WEP_API_TOKEN = "fedcba9876543210fedcba9876543210"),"#,
        )
        .unwrap();
        assert_eq!(load_token(&base), "fedcba9876543210fedcba9876543210");

        fs::remove_dir_all(&base).ok();
    }

    #[tokio::test]
    async fn cors_preflight_passes_through_the_guard() {
        let app = || {
            Router::new()
                .route("/api/state", post(|| async { "ok" }))
                .layer(axum::middleware::from_fn(guard_request))
                .layer(axum::Extension(ApiToken(TEST_TOKEN.to_string())))
                .layer(cors_layer())
        };

        // Preflights never carry the custom header, so the guard must run
        // after (inside) the CORS layer.
        let req = HttpRequest::builder()
            .method("OPTIONS")
            .uri("/api/state")
            .header(ORIGIN, "null")
            .header("access-control-request-method", "POST")
            .header(
                "access-control-request-headers",
                "content-type,x-wengine-client",
            )
            .body(Body::empty())
            .unwrap();
        let response = app().oneshot(req).await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            response
                .headers()
                .get("access-control-allow-origin")
                .and_then(|value| value.to_str().ok()),
            Some("null")
        );
        assert!(response
            .headers()
            .contains_key("access-control-allow-headers"));
    }

    #[tokio::test]
    async fn cors_preflight_does_not_allow_foreign_origin() {
        let app = Router::new()
            .route("/api/state", post(|| async { "ok" }))
            .layer(axum::middleware::from_fn(guard_request))
            .layer(axum::Extension(ApiToken(TEST_TOKEN.to_string())))
            .layer(cors_layer());
        let req = HttpRequest::builder()
            .method("OPTIONS")
            .uri("/api/state")
            .header(ORIGIN, "https://evil.example")
            .header("access-control-request-method", "POST")
            .body(Body::empty())
            .unwrap();
        let response = app.oneshot(req).await.unwrap();
        assert!(response
            .headers()
            .get("access-control-allow-origin")
            .is_none());
    }
}
