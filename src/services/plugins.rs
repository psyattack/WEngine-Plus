use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use parking_lot::RwLock;
use serde::Serialize;

pub struct PluginDef {
    pub id: &'static str,
    pub name: &'static str,
    pub download_url: &'static str,
    pub binary_name: &'static str,
    pub is_zip: bool,
    pub strip_prefix: Option<&'static str>,
}

pub const PLUGINS: &[PluginDef] = &[
    PluginDef {
        id: "DepotDownloaderMod",
        name: "DepotDownloaderMod",
        download_url:
            "https://github.com/SteamAutoCracks/DepotDownloaderMod/releases/download/DepotDownloaderMod_3.4.0.2/Release.rar",
        binary_name: "DepotDownloaderMod.exe",
        is_zip: false,
        strip_prefix: Some("Release/net9.0/"),
    },
    PluginDef {
        id: "RePKG",
        name: "RePKG",
        download_url:
            "https://github.com/notscuffed/repkg/releases/download/v0.4.0-alpha/RePKG.zip",
        binary_name: "RePKG.exe",
        is_zip: true,
        strip_prefix: None,
    },
];

#[derive(Debug, Clone, Serialize)]
pub struct PluginStatus {
    pub ready: bool,
    pub depot_downloader_ready: bool,
    pub repkg_ready: bool,
    pub dotnet_ready: bool,
    pub is_downloading: bool,
    pub current_plugin: String,
    pub progress: f32,
    pub message: String,
    pub error: Option<String>,
}

pub struct PluginManager {
    plugins_dir: PathBuf,
    dotnet: Arc<crate::services::dotnet::DotnetManager>,
    status: Arc<RwLock<PluginStatus>>,
    is_working: Arc<AtomicBool>,
}

impl PluginManager {
    pub fn new(plugins_dir: PathBuf, dotnet: Arc<crate::services::dotnet::DotnetManager>) -> Self {
        let depot_ready = is_plugin_installed(&plugins_dir, &PLUGINS[0]);
        let repkg_ready = is_plugin_installed(&plugins_dir, &PLUGINS[1]);
        let dotnet_ready = dotnet.is_ready();
        let all_ready = depot_ready && repkg_ready && dotnet_ready;

        let status = PluginStatus {
            ready: all_ready,
            depot_downloader_ready: depot_ready,
            repkg_ready,
            dotnet_ready,
            is_downloading: false,
            current_plugin: String::new(),
            progress: if all_ready { 100.0 } else { 0.0 },
            message: if all_ready {
                "All plugins are installed".to_string()
            } else {
                "Plugins need installation".to_string()
            },
            error: None,
        };

        Self {
            plugins_dir,
            dotnet,
            status: Arc::new(RwLock::new(status)),
            is_working: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn get_status(&self) -> PluginStatus {
        let mut st = self.status.read().clone();
        if !st.is_downloading {
            let depot_ready = is_plugin_installed(&self.plugins_dir, &PLUGINS[0]);
            let repkg_ready = is_plugin_installed(&self.plugins_dir, &PLUGINS[1]);
            let dotnet_ready = self.dotnet.is_ready();
            st.depot_downloader_ready = depot_ready;
            st.repkg_ready = repkg_ready;
            st.dotnet_ready = dotnet_ready;
            st.ready = depot_ready && repkg_ready && dotnet_ready;
        }
        st
    }

    pub fn get_plugin_path(&self, id: &str) -> Option<PathBuf> {
        for plugin in PLUGINS {
            if plugin.id == id {
                let bin = self.plugins_dir.join(plugin.id).join(plugin.binary_name);
                if bin.exists() {
                    return Some(bin);
                }
                let direct = self.plugins_dir.join(plugin.binary_name);
                if direct.exists() {
                    return Some(direct);
                }
            }
        }
        None
    }

    pub fn start_ensure(self: &Arc<Self>) {
        if self.is_working.swap(true, Ordering::SeqCst) {
            return;
        }

        let mgr = Arc::clone(self);
        tokio::spawn(async move {
            let res = mgr.run_ensure().await;
            mgr.is_working.store(false, Ordering::SeqCst);
            let mut guard = mgr.status.write();
            guard.is_downloading = false;
            if let Err(e) = res {
                guard.error = Some(e.to_string());
                guard.message = format!("Plugin error: {}", e);
            } else {
                let depot_ready = is_plugin_installed(&mgr.plugins_dir, &PLUGINS[0]);
                let repkg_ready = is_plugin_installed(&mgr.plugins_dir, &PLUGINS[1]);
                let dotnet_ready = mgr.dotnet.is_ready();
                guard.depot_downloader_ready = depot_ready;
                guard.repkg_ready = repkg_ready;
                guard.dotnet_ready = dotnet_ready;
                guard.ready = depot_ready && repkg_ready && dotnet_ready;
                guard.progress = 100.0;
                guard.message = "All plugins ready".to_string();
                guard.current_plugin.clear();
            }
        });
    }

    async fn run_ensure(&self) -> anyhow::Result<()> {
        std::fs::create_dir_all(&self.plugins_dir)?;

        // Ensure .NET Runtime if not already available
        if !self.dotnet.is_ready() {
            {
                let mut guard = self.status.write();
                guard.is_downloading = true;
                guard.current_plugin = ".NET Runtime".to_string();
                guard.progress = 0.0;
                guard.message = "Downloading .NET Runtime 9.0 portable...".to_string();
            }
            self.dotnet.run_ensure().await?;
        }

        for plugin in PLUGINS {
            if is_plugin_installed(&self.plugins_dir, plugin) {
                continue;
            }

            {
                let mut guard = self.status.write();
                guard.is_downloading = true;
                guard.current_plugin = plugin.name.to_string();
                guard.progress = 0.0;
                guard.message = format!("Downloading {}...", plugin.name);
            }

            self.download_and_extract_plugin(plugin).await?;
        }

        Ok(())
    }

    async fn download_and_extract_plugin(&self, plugin: &PluginDef) -> anyhow::Result<()> {
        let plugin_dir = self.plugins_dir.join(plugin.id);
        std::fs::create_dir_all(&plugin_dir)?;

        let archive_ext = if plugin.is_zip { "zip" } else { "rar" };
        let archive_path = self.plugins_dir.join(format!("{}.{}", plugin.id, archive_ext));

        let client = reqwest::Client::builder()
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            .build()?;

        let response = client.get(plugin.download_url).send().await?;
        if !response.status().is_success() {
            anyhow::bail!("Failed to download {}: HTTP {}", plugin.name, response.status());
        }

        let bytes = response.bytes().await?;
        std::fs::write(&archive_path, &bytes)?;

        {
            let mut guard = self.status.write();
            guard.progress = 60.0;
            guard.message = format!("Extracting {}...", plugin.name);
        }

        let extract_res = if plugin.is_zip {
            extract_zip(&archive_path, &plugin_dir, plugin.strip_prefix)
        } else {
            extract_rar(&archive_path, &plugin_dir, plugin.strip_prefix)
        };

        let _ = std::fs::remove_file(&archive_path);
        extract_res?;

        if !is_plugin_installed(&self.plugins_dir, plugin) {
            anyhow::bail!("Plugin {} was extracted but binary {} not found in {:?}", plugin.name, plugin.binary_name, plugin_dir);
        }

        Ok(())
    }
}

pub fn is_plugin_installed(plugins_dir: &Path, plugin: &PluginDef) -> bool {
    let binary = plugins_dir.join(plugin.id).join(plugin.binary_name);
    if binary.exists() {
        return true;
    }
    let direct = plugins_dir.join(plugin.binary_name);
    direct.exists()
}

fn extract_zip(
    zip_path: &Path,
    target_dir: &Path,
    strip_prefix: Option<&str>,
) -> anyhow::Result<()> {
    let file = std::fs::File::open(zip_path)?;
    let mut archive = zip::ZipArchive::new(file)?;

    let norm_strip_prefix = strip_prefix.map(|p| {
        p.replace('\\', "/").trim_matches('/').to_string()
    });

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        if file.is_dir() {
            continue;
        }

        let raw_path = file.name().replace('\\', "/");
        let clean_path = raw_path.trim_start_matches('/');

        let rel_path_str = if let Some(ref prefix) = norm_strip_prefix {
            if clean_path.starts_with(prefix) {
                clean_path[prefix.len()..].trim_start_matches('/')
            } else {
                continue;
            }
        } else {
            clean_path
        };

        if rel_path_str.is_empty() {
            continue;
        }

        let outpath = target_dir.join(rel_path_str);
        if let Some(parent) = outpath.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let mut outfile = std::fs::File::create(&outpath)?;
        std::io::copy(&mut file, &mut outfile)?;
    }

    Ok(())
}

fn extract_rar(
    rar_path: &Path,
    target_dir: &Path,
    strip_prefix: Option<&str>,
) -> anyhow::Result<()> {
    let mut archive = unrar::Archive::new(rar_path).open_for_processing()?;

    let norm_strip_prefix = strip_prefix.map(|p| {
        p.replace('\\', "/").trim_matches('/').to_string()
    });

    while let Some(header) = archive.read_header()? {
        if header.entry().is_directory() {
            archive = header.skip()?;
            continue;
        }

        let raw_filename = header.entry().filename.to_string_lossy().replace('\\', "/");
        let clean_filename = raw_filename.trim_start_matches('/');

        let rel_path_str = if let Some(ref prefix) = norm_strip_prefix {
            if clean_filename.starts_with(prefix) {
                clean_filename[prefix.len()..].trim_start_matches('/')
            } else {
                archive = header.skip()?;
                continue;
            }
        } else {
            clean_filename
        };

        if rel_path_str.is_empty() {
            archive = header.skip()?;
            continue;
        }

        let outpath = target_dir.join(rel_path_str);
        if let Some(parent) = outpath.parent() {
            std::fs::create_dir_all(parent)?;
        }
        archive = header.extract_to(&outpath)?;
    }

    Ok(())
}
