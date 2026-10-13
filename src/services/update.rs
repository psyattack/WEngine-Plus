use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use parking_lot::RwLock;
use serde::{Deserialize, Serialize};
use tokio::io::AsyncWriteExt;

const GITHUB_API_LATEST: &str = "https://api.github.com/repos/psyattack/WEngine-Plus/releases/latest";

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum UpdateStatus {
    Idle,
    Checking,
    Downloading,
    ReadyToInstall,
    Installing,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateInfo {
    pub current_version: String,
    pub latest_version: Option<String>,
    pub has_update: bool,
    pub release_name: Option<String>,
    pub release_notes: Option<String>,
    pub download_url: Option<String>,
    pub status: UpdateStatus,
    pub progress: f32,
    pub error: Option<String>,
}

#[derive(Debug, Deserialize)]
struct GithubAsset {
    name: String,
    browser_download_url: String,
}

#[derive(Debug, Deserialize)]
struct GithubRelease {
    tag_name: String,
    name: Option<String>,
    body: Option<String>,
    assets: Vec<GithubAsset>,
}

pub fn parse_version(v: &str) -> Option<(u64, u64, u64)> {
    let clean = v.trim().trim_start_matches(|c| c == 'v' || c == 'V');
    let parts: Vec<&str> = clean.split('.').collect();
    if parts.is_empty() {
        return None;
    }
    let major = parts.get(0)?.parse().ok()?;
    let minor = parts.get(1).and_then(|p| p.parse().ok()).unwrap_or(0);
    let patch = parts.get(2).and_then(|p| p.parse().ok()).unwrap_or(0);
    Some((major, minor, patch))
}

pub fn is_newer_version(latest_tag: &str, current_ver: &str) -> bool {
    match (parse_version(latest_tag), parse_version(current_ver)) {
        (Some(l), Some(c)) => l > c,
        _ => {
            let l_clean = latest_tag.trim().trim_start_matches(|c| c == 'v' || c == 'V');
            let c_clean = current_ver.trim().trim_start_matches(|c| c == 'v' || c == 'V');
            !l_clean.is_empty() && l_clean != c_clean
        }
    }
}

#[allow(dead_code)]
pub struct UpdateManager {
    pub exe_dir: PathBuf,
    pub we_dir: PathBuf,
    pub scripts_dir: PathBuf,
    info: Arc<RwLock<UpdateInfo>>,
    is_busy: Arc<AtomicBool>,
    last_check: Arc<RwLock<Option<Instant>>>,
}

impl UpdateManager {
    pub fn new(exe_dir: PathBuf, we_dir: PathBuf, scripts_dir: PathBuf) -> Self {
        let current_version = env!("CARGO_PKG_VERSION").to_string();
        let info = UpdateInfo {
            current_version,
            latest_version: None,
            has_update: false,
            release_name: None,
            release_notes: None,
            download_url: None,
            status: UpdateStatus::Idle,
            progress: 0.0,
            error: None,
        };

        Self {
            exe_dir,
            we_dir,
            scripts_dir,
            info: Arc::new(RwLock::new(info)),
            is_busy: Arc::new(AtomicBool::new(false)),
            last_check: Arc::new(RwLock::new(None)),
        }
    }

    pub fn get_info(&self) -> UpdateInfo {
        self.info.read().clone()
    }

    pub async fn check_for_updates(&self, force: bool, mock: bool) -> UpdateInfo {
        if !force {
            let last = *self.last_check.read();
            if let Some(instant) = last {
                if instant.elapsed() < Duration::from_secs(300) {
                    return self.get_info();
                }
            }
        }

        {
            let mut guard = self.info.write();
            guard.status = UpdateStatus::Checking;
            guard.error = None;
        }

        let current_ver = self.info.read().current_version.clone();
        let user_agent = format!("WEngine-Plus/{}", current_ver);

        let is_mock = mock || std::env::var("WENGINE_MOCK_UPDATE").map(|v| v == "1" || v.eq_ignore_ascii_case("true")).unwrap_or(false);
        let api_url = if is_mock {
            "http://127.0.0.1:43196/api/update/mock/release".to_string()
        } else {
            std::env::var("WENGINE_UPDATE_URL").unwrap_or_else(|_| GITHUB_API_LATEST.to_string())
        };

        let client = match reqwest::Client::builder()
            .timeout(Duration::from_secs(15))
            .user_agent(&user_agent)
            .build()
        {
            Ok(c) => c,
            Err(e) => {
                let mut guard = self.info.write();
                guard.status = UpdateStatus::Error;
                guard.error = Some(format!("Failed to build HTTP client: {}", e));
                return guard.clone();
            }
        };

        match client.get(&api_url).send().await {
            Ok(resp) => {
                if !resp.status().is_success() {
                    let mut guard = self.info.write();
                    guard.status = UpdateStatus::Error;
                    guard.error = Some(format!("Update API returned HTTP {}", resp.status()));
                    return guard.clone();
                }

                match resp.json::<GithubRelease>().await {
                    Ok(release) => {
                        let latest_tag = release.tag_name.clone();
                        let has_update = is_newer_version(&latest_tag, &current_ver);

                        let exe_asset = release.assets.iter().find(|a| {
                            a.name == "wengine-helper.exe" || a.name.ends_with(".exe")
                        });

                        let download_url = exe_asset.map(|a| a.browser_download_url.clone());

                        let mut guard = self.info.write();
                        guard.latest_version = Some(latest_tag);
                        guard.has_update = has_update && download_url.is_some();
                        guard.release_name = release.name;
                        guard.release_notes = release.body;
                        guard.download_url = download_url;
                        guard.status = UpdateStatus::Idle;
                        guard.error = None;

                        *self.last_check.write() = Some(Instant::now());
                        guard.clone()
                    }
                    Err(e) => {
                        let mut guard = self.info.write();
                        guard.status = UpdateStatus::Error;
                        guard.error = Some(format!("Failed to parse release data: {}", e));
                        guard.clone()
                    }
                }
            }
            Err(e) => {
                let mut guard = self.info.write();
                guard.status = UpdateStatus::Error;
                guard.error = Some(format!("Network error checking updates: {}", e));
                guard.clone()
            }
        }
    }

    #[allow(dead_code)]
    pub fn start_check(self: &Arc<Self>, force: bool, mock: bool) {
        let mgr = Arc::clone(self);
        tokio::spawn(async move {
            mgr.check_for_updates(force, mock).await;
        });
    }

    pub fn start_download(self: &Arc<Self>) -> Result<(), String> {
        if self.is_busy.compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst).is_err() {
            return Err("An update operation is already in progress".to_string());
        }

        let download_url = match self.info.read().download_url.clone() {
            Some(u) => u,
            None => {
                self.is_busy.store(false, Ordering::SeqCst);
                return Err("No download URL available for update".to_string());
            }
        };

        let mgr = Arc::clone(self);
        tokio::spawn(async move {
            let res = mgr.run_download(&download_url).await;
            mgr.is_busy.store(false, Ordering::SeqCst);
            if let Err(e) = res {
                let mut guard = mgr.info.write();
                guard.status = UpdateStatus::Error;
                guard.error = Some(e.to_string());
            }
        });

        Ok(())
    }

    async fn run_download(&self, url: &str) -> anyhow::Result<()> {
        {
            let mut guard = self.info.write();
            guard.status = UpdateStatus::Downloading;
            guard.progress = 0.0;
            guard.error = None;
        }

        let current_ver = self.info.read().current_version.clone();
        let user_agent = format!("WEngine-Plus/{}", current_ver);

        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(300))
            .user_agent(&user_agent)
            .build()?;

        let resp = client.get(url).send().await?;
        if !resp.status().is_success() {
            anyhow::bail!("Failed to download update binary: HTTP {}", resp.status());
        }

        let total_size = resp.content_length().unwrap_or(0);
        let update_file = self.scripts_dir.join("wengine-helper.exe.update");
        let _ = std::fs::remove_file(&update_file);

        let mut file = tokio::fs::File::create(&update_file).await?;
        let mut stream = resp;
        let mut downloaded: u64 = 0;

        while let Some(chunk) = stream.chunk().await? {
            file.write_all(&chunk).await?;
            downloaded += chunk.len() as u64;

            if total_size > 0 {
                let pct = (downloaded as f32 / total_size as f32) * 100.0;
                let mut guard = self.info.write();
                guard.progress = pct.min(99.0);
            }
        }

        file.flush().await?;
        drop(file);

        // Validate downloaded file
        let meta = std::fs::metadata(&update_file)?;
        if meta.len() < 1_000_000 {
            let _ = std::fs::remove_file(&update_file);
            anyhow::bail!("Downloaded binary is too small ({} bytes), download failed", meta.len());
        }

        let mut header = [0u8; 2];
        let mut f = std::fs::File::open(&update_file)?;
        use std::io::Read;
        f.read_exact(&mut header)?;
        if &header != b"MZ" {
            let _ = std::fs::remove_file(&update_file);
            anyhow::bail!("Downloaded file is not a valid Windows executable");
        }

        {
            let mut guard = self.info.write();
            guard.status = UpdateStatus::ReadyToInstall;
            guard.progress = 100.0;
            guard.error = None;
        }

        Ok(())
    }

    pub fn apply_update(self: &Arc<Self>) -> Result<(), String> {
        let update_file = self.scripts_dir.join("wengine-helper.exe.update");
        if !update_file.exists() {
            return Err("Update file does not exist. Please download it first.".to_string());
        }

        crate::services::lifecycle::IS_UPDATING.store(true, Ordering::SeqCst);

        {
            let mut guard = self.info.write();
            guard.status = UpdateStatus::Installing;
        }

        let current_exe = std::env::current_exe().unwrap_or_else(|_| self.scripts_dir.join("wengine-helper.exe"));
        let target_exe = self.scripts_dir.join("wengine-helper.exe");
        let old_exe = self.scripts_dir.join("wengine-helper.exe.old");
        let scripts_dir = self.scripts_dir.clone();
        let _we_dir = self.we_dir.clone();

        tokio::spawn(async move {
            // Give 300ms so the HTTP response is sent back to the frontend
            tokio::time::sleep(Duration::from_millis(300)).await;

            let my_pid = std::process::id();
            let _ = std::fs::remove_file(&old_exe);

            // 1. Rename running current_exe to .old
            let rename_ok = std::fs::rename(&current_exe, &old_exe).is_ok();

            if rename_ok {
                // Move .update to target_exe
                if let Err(e) = std::fs::rename(&update_file, &target_exe) {
                    eprintln!("Failed to move update to target: {}", e);
                    let _ = std::fs::rename(&old_exe, &target_exe);
                    return;
                }

                // 2. Spawn new binary with --silent-patch-script
                #[cfg(windows)]
                {
                    use std::os::windows::process::CommandExt;
                    let mut cmd = std::process::Command::new(&target_exe);
                    cmd.args([
                        "--silent-patch-script",
                        "--old-pid",
                        &my_pid.to_string(),
                        "--old-exe",
                        &old_exe.to_string_lossy(),
                    ]);
                    cmd.current_dir(&scripts_dir);
                    cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW for background helper
                    let _ = cmd.spawn();
                }
                #[cfg(not(windows))]
                {
                    let _ = std::process::Command::new(&target_exe)
                        .args([
                            "--silent-patch-script",
                            "--old-pid",
                            &my_pid.to_string(),
                            "--old-exe",
                            &old_exe.to_string_lossy(),
                        ])
                        .current_dir(&scripts_dir)
                        .spawn();
                }

                std::process::exit(0);
            } else {
                // Fallback via PowerShell detached script if direct rename failed
                #[cfg(windows)]
                {
                    use std::os::windows::process::CommandExt;
                    let pid = my_pid;
                    let escaped_target = target_exe.to_string_lossy().replace('\'', "''");
                    let escaped_old = old_exe.to_string_lossy().replace('\'', "''");
                    let escaped_update = update_file.to_string_lossy().replace('\'', "''");
                    let escaped_scripts = scripts_dir.to_string_lossy().replace('\'', "''");

                    let ps_script = format!(
                        "$p = Get-Process -Id {} -ErrorAction SilentlyContinue; if ($p) {{ $p.WaitForExit(10000) }}; \
                        for ($i = 0; $i -lt 20; $i++) {{ \
                            Start-Sleep -Milliseconds 250; \
                            try {{ \
                                [System.IO.File]::Delete('{}'); \
                                [System.IO.File]::Move('{}', '{}'); \
                                [System.IO.File]::Move('{}', '{}'); \
                                Start-Process -FilePath '{}' -ArgumentList '--silent-patch-script --old-pid {} --old-exe \"{}\"' -WorkingDirectory '{}'; \
                                break; \
                            }} catch {{}} \
                        }}",
                        pid, escaped_old, escaped_target, escaped_old, escaped_update, escaped_target, escaped_target, pid, escaped_old, escaped_scripts
                    );

                    let mut cmd = std::process::Command::new("powershell");
                    cmd.args(["-NoProfile", "-WindowStyle", "Hidden", "-Command", &ps_script]);
                    cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
                    let _ = cmd.spawn();
                    std::process::exit(0);
                }
            }
        });

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_version() {
        assert_eq!(parse_version("v1.2.0"), Some((1, 2, 0)));
        assert_eq!(parse_version("1.2.0"), Some((1, 2, 0)));
        assert_eq!(parse_version("V2.10.5"), Some((2, 10, 5)));
        assert_eq!(parse_version("v1.3"), Some((1, 3, 0)));
        assert_eq!(parse_version("invalid"), None);
    }

    #[test]
    fn test_is_newer_version() {
        assert!(is_newer_version("v1.3.0", "1.2.0"));
        assert!(is_newer_version("v1.2.1", "1.2.0"));
        assert!(is_newer_version("v2.0.0", "1.9.9"));
        assert!(!is_newer_version("v1.2.0", "1.2.0"));
        assert!(!is_newer_version("v1.1.9", "1.2.0"));
        assert!(!is_newer_version("v1.0.0", "1.2.0"));
    }
}
