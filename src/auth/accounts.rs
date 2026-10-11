use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use aes_gcm::aead::{Aead, KeyInit};
use aes_gcm::{Aes256Gcm, Key, Nonce};
use base64::{engine::general_purpose, Engine as _};
use parking_lot::RwLock;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

const BUILTIN_ACCOUNT_BUNDLE_KEY: &[u8] = b"WegineHelper Steam accounts bundle";
const BUILTIN_ACCOUNT_BUNDLE: &str = concat!(
    "KioqKioqKioqKioq8sqxb7OzjvKhAeU7FHznrDxF5FDqMXMLWkQIoIRhNWcKxCqA14FRK6pnYld3i2/NjYC/WM9vr4It",
    "wLNyr5HS/oCYK0TT/B53l2ARl+RoaYggRndOq4bp1NtFNBPzjnWfMSFG0Ii+GwjIkdbstu6dKDamH7PbQWh2QkG4j5pv",
    "gsz1JKzu/3lwZOFR0Foq3kFFrC9Ct3dIWHOjPfm5XtrschtdP8sd01CkJHcQTjtV4+RcSvZQSMQWpR7kq2GvW6319Ojo",
    "FCETN3gcjq97s/mfX5HRHsqVY8S6Uc0BU9pV0nR6yKZNuFM="
);

#[derive(Debug, Serialize, Deserialize, Default)]
pub(crate) struct BuiltinAccountsBundle {
    pub download: Vec<(String, String)>,
    pub parser: (String, String),
}

pub(crate) fn load_builtin_bundle() -> Result<BuiltinAccountsBundle, String> {
    let raw = general_purpose::STANDARD
        .decode(BUILTIN_ACCOUNT_BUNDLE)
        .map_err(|e| e.to_string())?;
    if raw.len() < 12 {
        return Err("Built-in account bundle is malformed".into());
    }
    let (nonce, ciphertext) = raw.split_at(12);
    let key = Sha256::digest(BUILTIN_ACCOUNT_BUNDLE_KEY);
    let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&key));
    let plaintext = cipher
        .decrypt(Nonce::from_slice(nonce), ciphertext)
        .map_err(|e| e.to_string())?;
    serde_json::from_slice(&plaintext).map_err(|e| e.to_string())
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountItem {
    pub index: usize,
    pub username: String,
    pub is_custom: bool,
    #[serde(default)]
    pub is_auto: bool,
    #[serde(default, skip_serializing)]
    pub password: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountsData {
    pub selected_index: usize,
    pub accounts: Vec<AccountItem>,
}

impl Default for AccountsData {
    fn default() -> Self {
        Self {
            selected_index: 0,
            accounts: vec![AccountItem {
                index: 0,
                username: "Auto".to_string(),
                is_custom: false,
                is_auto: true,
                password: None,
            }],
        }
    }
}

pub struct AccountsManager {
    data: Arc<RwLock<AccountsData>>,
    storage_path: PathBuf,
}

impl AccountsManager {
    pub fn new(storage_dir: &Path) -> Self {
        let storage_path = storage_dir.join("download_accounts.json");
        let mut initial_data = if storage_path.exists() {
            fs::read_to_string(&storage_path)
                .ok()
                .and_then(|d| serde_json::from_str::<AccountsData>(&d).ok())
                .unwrap_or_default()
        } else {
            AccountsData::default()
        };

        // Normalize and ensure Auto account is present and index 0 is valid
        if initial_data.accounts.is_empty() {
            initial_data = AccountsData::default();
        } else {
            for acc in &mut initial_data.accounts {
                if acc.username == "Auto" || acc.username == "Auto / Anonymous" || !acc.is_custom {
                    acc.username = "Auto".to_string();
                    acc.is_custom = false;
                    acc.is_auto = true;
                } else {
                    acc.is_auto = false;
                }
            }
            if !initial_data.accounts.iter().any(|a| a.is_auto) {
                initial_data.accounts.insert(
                    0,
                    AccountItem {
                        index: 0,
                        username: "Auto".to_string(),
                        is_custom: false,
                        is_auto: true,
                        password: None,
                    },
                );
            }
        }

        Self {
            data: Arc::new(RwLock::new(initial_data)),
            storage_path,
        }
    }

    pub fn list(&self) -> AccountsData {
        self.data.read().clone()
    }

    pub fn select(&self, index: usize) -> bool {
        let mut guard = self.data.write();
        if guard.accounts.iter().any(|a| a.index == index) {
            guard.selected_index = index;
            let _ = self.save(&guard);
            true
        } else {
            false
        }
    }

    pub fn add_custom(&self, username: String, password: Option<String>) -> AccountItem {
        let mut guard = self.data.write();
        let next_index = guard.accounts.iter().map(|a| a.index).max().unwrap_or(0) + 1;
        let item = AccountItem {
            index: next_index,
            username,
            is_custom: true,
            is_auto: false,
            password,
        };
        guard.accounts.push(item.clone());
        let _ = self.save(&guard);
        item
    }

    pub fn remove_custom(&self, username: &str) -> bool {
        if username.eq_ignore_ascii_case("auto") {
            return false;
        }
        let mut guard = self.data.write();
        let orig_len = guard.accounts.len();
        guard.accounts.retain(|a| {
            if !a.is_custom || a.is_auto || a.username == "Auto" {
                true
            } else {
                a.username != username
            }
        });
        if guard.accounts.len() < orig_len {
            if !guard.accounts.iter().any(|a| a.index == guard.selected_index) {
                guard.selected_index = 0;
            }
            let _ = self.save(&guard);
            true
        } else {
            false
        }
    }

    pub fn get_credentials_for_active_selection(&self) -> Vec<(String, String)> {
        let guard = self.data.read();
        let selected_opt = guard.accounts.iter().find(|a| a.index == guard.selected_index);
        if let Some(acc) = selected_opt {
            if acc.is_custom && !acc.is_auto {
                return vec![(
                    acc.username.clone(),
                    acc.password.clone().unwrap_or_default(),
                )];
            }
        }

        // Built-in accounts bundle
        if let Ok(bundle) = load_builtin_bundle() {
            if !bundle.download.is_empty() {
                return bundle.download;
            }
        }

        vec![("anonymous".to_string(), "".to_string())]
    }

    fn save(&self, data: &AccountsData) -> anyhow::Result<()> {
        let json = serde_json::to_string_pretty(data)?;
        fs::write(&self.storage_path, json)?;
        Ok(())
    }
}

use std::process::Stdio;
use tokio::io::AsyncReadExt;
use tokio::process::{Child, Command};
use tokio::sync::Mutex as AsyncMutex;

#[derive(Debug, Clone, Serialize, Default)]
pub struct QrDownloadStatus {
    pub status: String,
    pub qr_data: Option<String>,
    pub username: Option<String>,
    pub error: Option<String>,
}

pub struct QrDownloadAuthManager {
    child: Arc<AsyncMutex<Option<Child>>>,
    status: Arc<parking_lot::Mutex<QrDownloadStatus>>,
}

impl QrDownloadAuthManager {
    pub fn new() -> Self {
        Self {
            child: Arc::new(AsyncMutex::new(None)),
            status: Arc::new(parking_lot::Mutex::new(QrDownloadStatus {
                status: "idle".to_string(),
                ..Default::default()
            })),
        }
    }

    pub fn get_status(&self) -> QrDownloadStatus {
        self.status.lock().clone()
    }

    pub async fn cancel(&self) {
        let mut guard = self.child.lock().await;
        if let Some(mut ch) = guard.take() {
            let _ = ch.kill().await;
        }
        *self.status.lock() = QrDownloadStatus {
            status: "idle".to_string(),
            ..Default::default()
        };
    }

    pub async fn start(
        &self,
        depot_exe: PathBuf,
        accounts: Arc<AccountsManager>,
        dotnet_root: Option<PathBuf>,
    ) -> anyhow::Result<()> {
        self.cancel().await;

        if !depot_exe.exists() {
            anyhow::bail!("DepotDownloaderMod.exe not found at {}", depot_exe.display());
        }

        let mut cmd = Command::new(&depot_exe);
        if let Some(ref root) = dotnet_root {
            cmd.env("DOTNET_ROOT", root);
            if let Some(path_var) = std::env::var_os("PATH") {
                let mut new_path = std::ffi::OsString::from(root);
                new_path.push(";");
                new_path.push(path_var);
                cmd.env("PATH", new_path);
            }
        }
        cmd.args([
            "-app", "730",
            "-depot", "0",
            "-remember-password",
            "-qr",
        ])
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true);

        #[cfg(windows)]
        {
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            cmd.creation_flags(CREATE_NO_WINDOW);
        }

        let mut child = cmd.spawn()?;
        let stdout = child.stdout.take();
        let stderr = child.stderr.take();

        *self.child.lock().await = Some(child);
        *self.status.lock() = QrDownloadStatus {
            status: "starting".to_string(),
            ..Default::default()
        };

        let (tx, mut rx) = tokio::sync::mpsc::channel::<String>(100);

        if let Some(mut out) = stdout {
            let tx = tx.clone();
            tokio::spawn(async move {
                let mut buf = [0u8; 1024];
                let mut pending: Vec<u8> = Vec::new();
                while let Ok(n) = out.read(&mut buf).await {
                    if n == 0 { break; }
                    pending.extend_from_slice(&buf[..n]);
                    while let Some(pos) = pending.iter().position(|&b| b == b'\n') {
                        let mut line_bytes: Vec<u8> = pending.drain(..=pos).collect();
                        line_bytes.pop();
                        if line_bytes.last() == Some(&b'\r') { line_bytes.pop(); }
                        let line = String::from_utf8_lossy(&line_bytes).into_owned();
                        let _ = tx.send(line).await;
                    }
                }
                if !pending.is_empty() {
                    if pending.last() == Some(&b'\r') { pending.pop(); }
                    let line = String::from_utf8_lossy(&pending).into_owned();
                    let _ = tx.send(line).await;
                }
            });
        }

        if let Some(err) = stderr {
            let tx = tx.clone();
            tokio::spawn(async move {
                use tokio::io::AsyncBufReadExt;
                let mut reader = tokio::io::BufReader::new(err);
                let mut line = String::new();
                while let Ok(n) = reader.read_line(&mut line).await {
                    if n == 0 { break; }
                    let trimmed = line.trim().to_string();
                    if !trimmed.is_empty() {
                        let _ = tx.send(trimmed).await;
                    }
                    line.clear();
                }
            });
        }
        drop(tx);

        let status_arc = Arc::clone(&self.status);
        let child_arc = Arc::clone(&self.child);

        tokio::spawn(async move {
            let mut capturing_qr = false;
            let mut qr_data = String::new();
            let mut qr_emitted = false;
            let mut empty_line_count = 0;
            let mut qr_username = "qr_user".to_string();

            use tokio::time::{timeout, Duration};
            loop {
                let line = match timeout(Duration::from_millis(400), rx.recv()).await {
                    Ok(Some(line)) => line,
                    Ok(None) => break,
                    Err(_) => {
                        if capturing_qr && !qr_emitted && (qr_data.contains('\u{2588}') || qr_data.contains('█')) {
                            let mut s = status_arc.lock();
                            s.status = "waiting_qr".to_string();
                            s.qr_data = Some(qr_data.clone());
                            qr_emitted = true;
                        }
                        continue;
                    }
                };

                let lower = line.to_lowercase();
                if lower.contains("unhandled exception") || lower.contains("fatal error") {
                    let mut s = status_arc.lock();
                    s.status = "failed".to_string();
                    s.error = Some("DepotDownloader crashed".to_string());
                    break;
                }

                if lower.contains("success! next time you can login") {
                    if let Some(idx) = lower.find("-username ") {
                        let rest = &line[idx + "-username ".len()..];
                        if let Some(name) = rest.split_whitespace().next() {
                            if !name.is_empty() {
                                qr_username = name.to_string();
                            }
                        }
                    }
                }

                if lower.contains("licenses for account") {
                    let _ = accounts.add_custom(qr_username.clone(), None);
                    let mut s = status_arc.lock();
                    s.status = "success".to_string();
                    s.username = Some(qr_username.clone());
                    break;
                }

                if lower.contains("failed to authenticate") || lower.contains("authentication failed") {
                    let mut s = status_arc.lock();
                    s.status = "failed".to_string();
                    s.error = Some("Authentication failed".to_string());
                    break;
                }

                if capturing_qr {
                    let is_empty_or_spaces = line.chars().all(|ch| ch == ' ');
                    let has_blocks = line.contains('█') || line.contains('▄') || line.contains('▀') || line.contains('\u{FFFD}');

                    if is_empty_or_spaces || has_blocks {
                        let fixed_line = line.replace('\u{FFFD}', "\u{2588}");
                        qr_data.push_str(&fixed_line);
                        qr_data.push('\n');

                        if is_empty_or_spaces && !has_blocks {
                            if qr_data.contains('█') || qr_data.contains('\u{FFFD}') || qr_data.contains('\u{2588}') {
                                empty_line_count += 1;
                                if empty_line_count >= 2 && !qr_emitted {
                                    let mut s = status_arc.lock();
                                    s.status = "waiting_qr".to_string();
                                    s.qr_data = Some(qr_data.clone());
                                    qr_emitted = true;
                                }
                            }
                        } else {
                            empty_line_count = 0;
                        }
                    } else {
                        capturing_qr = false;
                        if !qr_emitted && (qr_data.contains('█') || qr_data.contains('\u{FFFD}') || qr_data.contains('\u{2588}')) {
                            let mut s = status_arc.lock();
                            s.status = "waiting_qr".to_string();
                            s.qr_data = Some(qr_data.clone());
                            qr_emitted = true;
                        }
                    }
                } else if lower.contains("with this qr code:") || lower.contains("qr code has changed:") {
                    capturing_qr = true;
                    qr_data.clear();
                    empty_line_count = 0;
                    qr_emitted = false;
                }
            }

            if !qr_emitted && (qr_data.contains('\u{2588}') || qr_data.contains('█')) {
                let mut s = status_arc.lock();
                s.status = "waiting_qr".to_string();
                s.qr_data = Some(qr_data.clone());
            }

            let mut guard = child_arc.lock().await;
            if let Some(mut ch) = guard.take() {
                let _ = ch.kill().await;
            }
        });

        Ok(())
    }
}
