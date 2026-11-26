use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use parking_lot::{Mutex, RwLock};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tokio::io::AsyncWriteExt;

const GITHUB_API_LATEST: &str =
    "https://api.github.com/repos/psyattack/WEngine-Plus/releases/latest";

/// Release asset the updater downloads; it is a zip archive with the executable inside.
const UPDATE_ARCHIVE_NAME: &str = "wengine-helper.exe.update.zip";
/// Staged executable that [`UpdateManager::apply_update`] moves over the running binary.
const UPDATE_EXE_NAME: &str = "wengine-helper.exe.update";
/// Archive entry that becomes the new executable.
const UPDATE_ENTRY_NAME: &str = "wengine-helper.exe";
/// A downloaded executable smaller than this is rejected as incomplete.
const MIN_UPDATE_BYTES: u64 = 1_000_000;
/// Upper bound for the extracted executable; a real build is far below it.
const MAX_UPDATE_BYTES: u64 = 64 * 1024 * 1024;

/// The daemon's own API. Mock release endpoints live there and require the client token, unlike
/// GitHub, which must never receive it.
fn is_local_api(url: &str) -> bool {
    url.starts_with("http://127.0.0.1:43196")
}

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
    /// Size reported by the GitHub API; compared with the downloaded byte count.
    #[serde(default)]
    size: u64,
    /// `sha256:<hex>` published by the GitHub API for uploaded release assets.
    #[serde(default)]
    digest: Option<String>,
}

/// The zip archive selected for the current release, kept in memory between the check and the
/// download so the digest and size cannot be swapped by a second release payload.
#[derive(Debug, Clone)]
struct UpdateAsset {
    name: String,
    url: String,
    size: u64,
    sha256: String,
}

#[derive(Debug, Deserialize)]
struct GithubRelease {
    tag_name: String,
    name: Option<String>,
    body: Option<String>,
    assets: Vec<GithubAsset>,
}

pub fn parse_version(v: &str) -> Option<(u64, u64, u64)> {
    let clean = v.trim().trim_start_matches(['v', 'V']);
    let parts: Vec<&str> = clean.split('.').collect();
    if parts.is_empty() {
        return None;
    }
    let major = parts.first()?.parse().ok()?;
    let minor = parts.get(1).and_then(|p| p.parse().ok()).unwrap_or(0);
    let patch = parts.get(2).and_then(|p| p.parse().ok()).unwrap_or(0);
    Some((major, minor, patch))
}

pub fn is_newer_version(latest_tag: &str, current_ver: &str) -> bool {
    match (parse_version(latest_tag), parse_version(current_ver)) {
        (Some(l), Some(c)) => l > c,
        _ => {
            let l_clean = latest_tag.trim().trim_start_matches(['v', 'V']);
            let c_clean = current_ver.trim().trim_start_matches(['v', 'V']);
            !l_clean.is_empty() && l_clean != c_clean
        }
    }
}

/// Extracts a lowercase SHA-256 hex digest from a GitHub `digest` value (`sha256:<hex>`, with or
/// without the prefix). Returns `None` for anything that is not a full SHA-256 digest.
fn parse_sha256_digest(digest: &str) -> Option<String> {
    let lower = digest.trim().to_ascii_lowercase();
    let hex = lower.strip_prefix("sha256:").unwrap_or(&lower);
    if hex.len() == 64 && hex.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        Some(hex.to_string())
    } else {
        None
    }
}

fn hex_encode(bytes: &[u8]) -> String {
    use std::fmt::Write as _;
    let mut out = String::with_capacity(bytes.len() * 2);
    for byte in bytes {
        let _ = write!(out, "{byte:02x}");
    }
    out
}

/// Picks the single zip asset of a release and requires the size and SHA-256 digest GitHub
/// publishes for it. A release without a usable archive must never reach the download stage.
fn select_update_asset(assets: &[GithubAsset]) -> anyhow::Result<UpdateAsset> {
    let mut archives = assets
        .iter()
        .filter(|asset| asset.name.to_ascii_lowercase().ends_with(".zip"));
    let Some(asset) = archives.next() else {
        anyhow::bail!("The release has no .zip update archive");
    };
    if archives.next().is_some() {
        anyhow::bail!("The release has more than one .zip asset; cannot choose the update archive");
    }
    if asset.size == 0 {
        anyhow::bail!(
            "Update archive {} has no size reported by GitHub",
            asset.name
        );
    }
    let Some(sha256) = asset.digest.as_deref().and_then(parse_sha256_digest) else {
        anyhow::bail!(
            "Update archive {} has no published SHA-256 digest; refusing to update",
            asset.name
        );
    };
    Ok(UpdateAsset {
        name: asset.name.clone(),
        url: asset.browser_download_url.clone(),
        size: asset.size,
        sha256,
    })
}

fn verify_asset_digest(asset_name: &str, expected: &str, actual: &str) -> anyhow::Result<()> {
    if !expected.eq_ignore_ascii_case(actual) {
        anyhow::bail!(
            "Update archive checksum mismatch for {asset_name}: expected {expected}, received {actual}"
        );
    }
    Ok(())
}

/// Extracts the executable entry from the update archive into `target`.
///
/// Only the declared entry is written; the archive is never unpacked by path, so other entries
/// and their paths are irrelevant. The size limit applies to the bytes actually copied, not only
/// to the size in the archive header, and reading the entry to EOF makes the zip crate verify its
/// CRC.
fn extract_update_executable(zip_path: &Path, target: &Path, max_bytes: u64) -> anyhow::Result<()> {
    let file = fs::File::open(zip_path)?;
    let mut archive = zip::ZipArchive::new(file).map_err(|err| {
        anyhow::anyhow!("Downloaded update archive is not a valid zip file: {err}")
    })?;

    let mut found = None;
    for index in 0..archive.len() {
        let entry = archive.by_index_raw(index)?;
        if entry.is_dir() {
            continue;
        }
        let raw_name = entry
            .name()
            .map_err(|err| anyhow::anyhow!("Update archive has an unreadable entry name: {err}"))?;
        let name = raw_name.replace('\\', "/");
        let Some(base_name) = name.rsplit('/').next() else {
            continue;
        };
        if !base_name.eq_ignore_ascii_case(UPDATE_ENTRY_NAME) {
            continue;
        }
        if name.starts_with('/') || name.split('/').any(|part| part == ".." || part == ".") {
            anyhow::bail!("Update archive entry {name} has an unsafe path");
        }
        if found.is_some() {
            anyhow::bail!("Update archive contains more than one {UPDATE_ENTRY_NAME}");
        }
        if entry.size() == 0 || entry.size() > max_bytes {
            anyhow::bail!(
                "Update archive entry {name} has an unexpected size ({} bytes)",
                entry.size()
            );
        }
        found = Some(index);
    }

    let Some(index) = found else {
        anyhow::bail!("Update archive does not contain {UPDATE_ENTRY_NAME}");
    };

    let mut entry = archive.by_index(index)?;
    let copied = (|| -> anyhow::Result<u64> {
        let mut out = fs::File::create(target)?;
        let mut reader = (&mut entry).take(max_bytes + 1);
        let copied = std::io::copy(&mut reader, &mut out)?;
        out.flush()?;
        Ok(copied)
    })();

    match copied {
        Ok(0) => {
            let _ = fs::remove_file(target);
            anyhow::bail!("Update archive entry {UPDATE_ENTRY_NAME} is empty");
        }
        Ok(bytes) if bytes > max_bytes => {
            let _ = fs::remove_file(target);
            anyhow::bail!(
                "Update archive entry {UPDATE_ENTRY_NAME} is larger than {max_bytes} bytes"
            );
        }
        Ok(_) => Ok(()),
        Err(err) => {
            let _ = fs::remove_file(target);
            Err(err)
        }
    }
}

/// Rejects an incomplete or foreign file before it can replace the running executable.
fn validate_update_executable(path: &Path) -> anyhow::Result<()> {
    let meta = fs::metadata(path)?;
    if meta.len() < MIN_UPDATE_BYTES {
        anyhow::bail!(
            "Downloaded update executable is too small ({} bytes)",
            meta.len()
        );
    }
    let mut header = [0u8; 2];
    fs::File::open(path)?.read_exact(&mut header)?;
    if &header != b"MZ" {
        anyhow::bail!("Downloaded update is not a Windows executable");
    }
    Ok(())
}

#[allow(dead_code)]
pub struct UpdateManager {
    pub exe_dir: PathBuf,
    pub we_dir: PathBuf,
    pub scripts_dir: PathBuf,
    info: Arc<RwLock<UpdateInfo>>,
    is_busy: Arc<AtomicBool>,
    last_check: Arc<RwLock<Option<Instant>>>,
    /// Asset selected by the last successful check, consumed by the download.
    pending: Mutex<Option<UpdateAsset>>,
    http: reqwest::Client,
    /// Token used when the update source is the daemon's own mock endpoints.
    api_token: String,
}

impl UpdateManager {
    pub fn new(
        exe_dir: PathBuf,
        we_dir: PathBuf,
        scripts_dir: PathBuf,
        http: reqwest::Client,
        api_token: String,
    ) -> Self {
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
            pending: Mutex::new(None),
            http,
            api_token,
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

        let is_mock = mock
            || std::env::var("WENGINE_MOCK_UPDATE")
                .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
                .unwrap_or(false);
        let api_url = if is_mock {
            "http://127.0.0.1:43196/api/update/mock/release".to_string()
        } else {
            std::env::var("WENGINE_UPDATE_URL").unwrap_or_else(|_| GITHUB_API_LATEST.to_string())
        };

        let mut request = self.http.get(&api_url).timeout(Duration::from_secs(15));
        if is_local_api(&api_url) {
            request = request.header(crate::api_security::CLIENT_HEADER, &self.api_token);
        }

        match request.send().await {
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

                        let mut selected = None;
                        let mut error = None;
                        if has_update {
                            match select_update_asset(&release.assets) {
                                Ok(asset) => selected = Some(asset),
                                Err(err) => error = Some(err.to_string()),
                            }
                        }
                        let download_url = selected.as_ref().map(|asset| asset.url.clone());
                        *self.pending.lock() = selected;

                        let mut guard = self.info.write();
                        guard.latest_version = Some(latest_tag);
                        guard.has_update = has_update && download_url.is_some();
                        guard.release_name = release.name;
                        guard.release_notes = release.body;
                        guard.download_url = download_url;
                        guard.status = if error.is_some() {
                            UpdateStatus::Error
                        } else {
                            UpdateStatus::Idle
                        };
                        guard.error = error;

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
        if self
            .is_busy
            .compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst)
            .is_err()
        {
            return Err("An update operation is already in progress".to_string());
        }

        let asset = match self.pending.lock().clone() {
            Some(asset) => asset,
            None => {
                self.is_busy.store(false, Ordering::SeqCst);
                return Err("No update archive is available; check for updates first".to_string());
            }
        };

        let mgr = Arc::clone(self);
        tokio::spawn(async move {
            let res = mgr.run_download(&asset).await;
            mgr.is_busy.store(false, Ordering::SeqCst);
            if let Err(e) = res {
                let mut guard = mgr.info.write();
                guard.status = UpdateStatus::Error;
                guard.error = Some(e.to_string());
            }
        });

        Ok(())
    }

    async fn run_download(&self, asset: &UpdateAsset) -> anyhow::Result<()> {
        {
            let mut guard = self.info.write();
            guard.status = UpdateStatus::Downloading;
            guard.progress = 0.0;
            guard.error = None;
        }

        let archive = self.scripts_dir.join(UPDATE_ARCHIVE_NAME);
        let update_exe = self.scripts_dir.join(UPDATE_EXE_NAME);
        let _ = fs::remove_file(&archive);
        let _ = fs::remove_file(&update_exe);

        let staged = self.stage_update(asset, &archive, &update_exe).await;
        let _ = fs::remove_file(&archive);
        if let Err(err) = staged {
            let _ = fs::remove_file(&update_exe);
            return Err(err);
        }

        let mut guard = self.info.write();
        guard.status = UpdateStatus::ReadyToInstall;
        guard.progress = 100.0;
        guard.error = None;
        Ok(())
    }

    /// Downloads the release archive, verifies it, and extracts the executable into `.update`.
    async fn stage_update(
        &self,
        asset: &UpdateAsset,
        archive: &Path,
        update_exe: &Path,
    ) -> anyhow::Result<()> {
        let (downloaded, actual_sha256) = self.download_archive(asset, archive).await?;

        if downloaded == 0 {
            anyhow::bail!("Downloaded update archive is empty");
        }
        if downloaded != asset.size {
            anyhow::bail!(
                "Update archive size mismatch: expected {} bytes, received {downloaded}",
                asset.size
            );
        }
        verify_asset_digest(&asset.name, &asset.sha256, &actual_sha256)?;

        extract_update_executable(archive, update_exe, MAX_UPDATE_BYTES)?;
        validate_update_executable(update_exe)?;
        Ok(())
    }

    async fn download_archive(
        &self,
        asset: &UpdateAsset,
        archive: &Path,
    ) -> anyhow::Result<(u64, String)> {
        let mut request = self.http.get(&asset.url).timeout(Duration::from_secs(300));
        if is_local_api(&asset.url) {
            request = request.header(crate::api_security::CLIENT_HEADER, &self.api_token);
        }
        let response = request.send().await?;
        if !response.status().is_success() {
            anyhow::bail!(
                "Failed to download update archive: HTTP {}",
                response.status()
            );
        }

        let total_size = response.content_length().unwrap_or(asset.size);
        let mut file = tokio::fs::File::create(archive).await?;
        let mut hasher = Sha256::new();
        let mut downloaded: u64 = 0;
        let mut stream = response;

        while let Some(chunk) = stream.chunk().await? {
            file.write_all(&chunk).await?;
            hasher.update(&chunk);
            downloaded += chunk.len() as u64;

            if total_size > 0 {
                let pct = (downloaded as f32 / total_size as f32) * 100.0;
                let mut guard = self.info.write();
                guard.progress = pct.min(99.0);
            }
        }

        file.flush().await?;
        drop(file);

        Ok((downloaded, hex_encode(&hasher.finalize())))
    }

    pub fn apply_update(self: &Arc<Self>) -> Result<(), String> {
        let update_file = self.scripts_dir.join(UPDATE_EXE_NAME);
        if !update_file.exists() {
            return Err("Update file does not exist. Please download it first.".to_string());
        }
        if let Err(err) = validate_update_executable(&update_file) {
            let _ = fs::remove_file(&update_file);
            return Err(format!("Staged update is not usable: {err}"));
        }

        crate::services::lifecycle::IS_UPDATING.store(true, Ordering::SeqCst);

        {
            let mut guard = self.info.write();
            guard.status = UpdateStatus::Installing;
        }

        let current_exe =
            std::env::current_exe().unwrap_or_else(|_| self.scripts_dir.join("wengine-helper.exe"));
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
                    log_error!("failed to move update into place: {e}");
                    let _ = std::fs::rename(&old_exe, &target_exe);
                    return;
                }

                // 2. Spawn new binary with --silent
                #[cfg(windows)]
                {
                    use std::os::windows::process::CommandExt;
                    let mut cmd = std::process::Command::new(&target_exe);
                    cmd.arg("--silent");
                    cmd.current_dir(&scripts_dir);
                    cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW for background helper
                    let _ = cmd.spawn();
                }
                #[cfg(not(windows))]
                {
                    let _ = std::process::Command::new(&target_exe)
                        .arg("--silent")
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
                                Start-Process -FilePath '{}' -ArgumentList '--silent' -WorkingDirectory '{}'; \
                                break; \
                            }} catch {{}} \
                        }}",
                        pid, escaped_old, escaped_target, escaped_old, escaped_update, escaped_target, escaped_target, escaped_scripts
                    );

                    let mut cmd = std::process::Command::new("powershell");
                    cmd.args([
                        "-NoProfile",
                        "-WindowStyle",
                        "Hidden",
                        "-Command",
                        &ps_script,
                    ]);
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

    fn temp_dir(tag: &str) -> PathBuf {
        std::env::temp_dir().join(format!(
            "wep-update-{tag}-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_nanos())
                .unwrap_or_default()
        ))
    }

    fn write_zip(path: &Path, entries: &[(&str, &[u8])]) {
        let mut writer = zip::ZipWriter::new(fs::File::create(path).unwrap());
        for (name, contents) in entries {
            writer
                .start_file(*name, zip::write::SimpleFileOptions::default())
                .unwrap();
            writer.write_all(contents).unwrap();
        }
        writer.finish().unwrap();
    }

    fn github_asset(name: &str, size: u64, digest: Option<&str>) -> GithubAsset {
        GithubAsset {
            name: name.to_string(),
            browser_download_url: format!("https://example.invalid/{name}"),
            size,
            digest: digest.map(str::to_string),
        }
    }

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

    #[test]
    fn parses_sha256_digest_forms() {
        let hex = "ab".repeat(32);
        assert_eq!(
            parse_sha256_digest(&format!("sha256:{hex}")),
            Some(hex.clone())
        );
        assert_eq!(
            parse_sha256_digest(&format!("  SHA256:{}  ", hex.to_ascii_uppercase())),
            Some(hex.clone())
        );
        assert_eq!(parse_sha256_digest(&hex), Some(hex));
        assert_eq!(parse_sha256_digest("sha256:abc"), None);
        assert_eq!(parse_sha256_digest("md5:0123456789abcdef"), None);
        assert_eq!(parse_sha256_digest(""), None);
    }

    #[test]
    fn verifies_the_asset_digest_case_insensitively() {
        let hex = "ab".repeat(32);
        assert!(verify_asset_digest("update.zip", &hex, &hex.to_ascii_uppercase()).is_ok());
        assert!(verify_asset_digest("update.zip", &hex, &"cd".repeat(32)).is_err());
    }

    #[test]
    fn selects_the_zip_asset() {
        let hex = "ab".repeat(32);
        let assets = [
            github_asset("SHA256SUMS.txt", 128, None),
            github_asset("WEngine-Plus-v2.0.1-Windows-x64.zip", 12_345, Some(&hex)),
        ];
        let asset = select_update_asset(&assets).unwrap();
        assert_eq!(asset.name, "WEngine-Plus-v2.0.1-Windows-x64.zip");
        assert_eq!(asset.size, 12_345);
        assert_eq!(asset.sha256, hex);
    }

    #[test]
    fn rejects_releases_without_a_usable_archive() {
        let hex = "ab".repeat(32);
        assert!(select_update_asset(&[github_asset("SHA256SUMS.txt", 128, None)]).is_err());
        assert!(select_update_asset(&[
            github_asset("one.zip", 1, Some(&hex)),
            github_asset("two.zip", 2, Some(&hex)),
        ])
        .is_err());
        assert!(select_update_asset(&[github_asset("archive.zip", 0, Some(&hex))]).is_err());
        let err = select_update_asset(&[github_asset("archive.zip", 10, None)]).unwrap_err();
        assert!(err.to_string().contains("SHA-256"));
        assert!(
            select_update_asset(&[github_asset("archive.zip", 10, Some("sha256:xyz"))]).is_err()
        );
    }

    #[test]
    fn extracts_the_executable_from_the_archive() {
        let dir = temp_dir("extract");
        fs::create_dir_all(&dir).unwrap();
        let zip = dir.join("update.zip");
        write_zip(
            &zip,
            &[("README.md", b"docs"), ("wengine-helper.exe", b"MZpayload")],
        );
        let target = dir.join(UPDATE_EXE_NAME);
        extract_update_executable(&zip, &target, MAX_UPDATE_BYTES).unwrap();
        assert_eq!(fs::read(&target).unwrap(), b"MZpayload");
        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn extracts_a_nested_executable_entry() {
        let dir = temp_dir("nested");
        fs::create_dir_all(&dir).unwrap();
        let zip = dir.join("update.zip");
        write_zip(&zip, &[("bin/wengine-helper.exe", b"MZnested")]);
        let target = dir.join(UPDATE_EXE_NAME);
        extract_update_executable(&zip, &target, MAX_UPDATE_BYTES).unwrap();
        assert_eq!(fs::read(&target).unwrap(), b"MZnested");
        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn rejects_archives_without_exactly_one_executable() {
        let dir = temp_dir("entries");
        fs::create_dir_all(&dir).unwrap();
        let target = dir.join(UPDATE_EXE_NAME);

        let missing = dir.join("missing.zip");
        write_zip(&missing, &[("helper.exe", b"MZ")]);
        assert!(extract_update_executable(&missing, &target, MAX_UPDATE_BYTES).is_err());
        assert!(!target.exists());

        let duplicate = dir.join("duplicate.zip");
        write_zip(
            &duplicate,
            &[
                ("wengine-helper.exe", b"MZone"),
                ("bin/wengine-helper.exe", b"MZtwo"),
            ],
        );
        assert!(extract_update_executable(&duplicate, &target, MAX_UPDATE_BYTES).is_err());
        assert!(!target.exists());

        let unsafe_path = dir.join("unsafe.zip");
        write_zip(&unsafe_path, &[("../wengine-helper.exe", b"MZ")]);
        assert!(extract_update_executable(&unsafe_path, &target, MAX_UPDATE_BYTES).is_err());
        assert!(!target.exists());

        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn enforces_the_extracted_size_limit() {
        let dir = temp_dir("limit");
        fs::create_dir_all(&dir).unwrap();
        let zip = dir.join("update.zip");
        write_zip(&zip, &[("wengine-helper.exe", b"MZ0123456789")]);
        let target = dir.join(UPDATE_EXE_NAME);
        assert!(extract_update_executable(&zip, &target, 4).is_err());
        assert!(!target.exists());
        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn validates_the_staged_executable() {
        let dir = temp_dir("validate");
        fs::create_dir_all(&dir).unwrap();
        let path = dir.join(UPDATE_EXE_NAME);

        fs::write(&path, vec![b'X'; MIN_UPDATE_BYTES as usize]).unwrap();
        assert!(validate_update_executable(&path).is_err());

        fs::write(&path, b"MZ").unwrap();
        assert!(validate_update_executable(&path).is_err());

        let mut data = vec![0u8; MIN_UPDATE_BYTES as usize];
        data[0] = b'M';
        data[1] = b'Z';
        fs::write(&path, &data).unwrap();
        assert!(validate_update_executable(&path).is_ok());

        fs::remove_dir_all(&dir).ok();
    }
}
