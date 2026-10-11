use std::collections::{HashMap, HashSet};
use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::sync::Arc;

use once_cell::sync::Lazy;
use parking_lot::Mutex;
use regex::Regex;
use serde::{Deserialize, Serialize};
use tokio::io::{AsyncBufReadExt, AsyncReadExt, BufReader};
use tokio::process::{Child, Command};
use tokio::sync::Mutex as AsyncMutex;

use crate::auth::accounts::AccountsManager;

static PROGRESS_RE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"(\d{1,3}(?:[.,]\d+)?)\s*%").expect("progress regex"));

const STEAM_APP_ID: &str = "431960";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskStatus {
    pub pubfileid: String,
    pub status: String,
    pub account: String,
    pub phase: Phase,
    pub progress: Option<f32>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Phase {
    Starting,
    Running,
    Completed,
    Failed,
    Cancelled,
}

type ChildHandle = Arc<AsyncMutex<Option<Child>>>;
type HandleMap = HashMap<String, ChildHandle>;

pub struct DownloadManager {
    tasks: Arc<Mutex<HashMap<String, TaskStatus>>>,
    handles: Arc<Mutex<HandleMap>>,
    cancelled: Arc<Mutex<HashSet<String>>>,
}

impl DownloadManager {
    pub fn new() -> Self {
        Self {
            tasks: Arc::new(Mutex::new(HashMap::new())),
            handles: Arc::new(Mutex::new(HashMap::new())),
            cancelled: Arc::new(Mutex::new(HashSet::new())),
        }
    }

    pub fn list(&self) -> HashMap<String, TaskStatus> {
        self.tasks.lock().clone()
    }

    pub fn get(&self, pubfileid: &str) -> Option<TaskStatus> {
        self.tasks.lock().get(pubfileid).cloned()
    }

    pub fn clear(&self, pubfileid: &str) {
        self.tasks.lock().remove(pubfileid);
    }

    pub async fn start(
        &self,
        pubfileid: String,
        accounts: Arc<AccountsManager>,
        we_dir: PathBuf,
        plugin_path: PathBuf,
        dotnet_root: Option<PathBuf>,
    ) -> anyhow::Result<()> {
        let pubfileid = pubfileid.trim().to_string();
        if pubfileid.is_empty() {
            anyhow::bail!("Empty pubfileid");
        }

        // Check if already downloading
        if let Some(existing) = self.tasks.lock().get(&pubfileid) {
            if existing.phase == Phase::Starting || existing.phase == Phase::Running {
                return Ok(());
            }
        }

        self.cancelled.lock().remove(&pubfileid);

        let output_dir = we_dir
            .join("projects")
            .join("myprojects")
            .join(&pubfileid);

        let creds_list = accounts.get_credentials_for_active_selection();
        let first_user = creds_list.first().map(|c| c.0.clone()).unwrap_or_else(|| "Auto".to_string());

        let initial_status = TaskStatus {
            pubfileid: pubfileid.clone(),
            status: "Starting download...".to_string(),
            account: first_user,
            phase: Phase::Starting,
            progress: Some(0.0),
        };
        self.tasks.lock().insert(pubfileid.clone(), initial_status);

        let tasks = Arc::clone(&self.tasks);
        let handles = Arc::clone(&self.handles);
        let cancelled = Arc::clone(&self.cancelled);
        let pubfileid_owned = pubfileid.clone();
        let output_dir_str = output_dir.to_string_lossy().to_string();

        tokio::spawn(async move {
            let pubfileid = pubfileid_owned;
            let mut creds_idx = 0;
            let total_creds = creds_list.len().max(1);

            loop {
                if cancelled.lock().contains(&pubfileid) {
                    break;
                }

                let (username, password) = creds_list
                    .get(creds_idx)
                    .cloned()
                    .unwrap_or_else(|| ("anonymous".to_string(), "".to_string()));

                {
                    let mut guard = tasks.lock();
                    if let Some(t) = guard.get_mut(&pubfileid) {
                        t.status = format!("Connecting as {}...", username);
                        t.account = username.clone();
                        t.phase = Phase::Running;
                    }
                }

                let mut cmd = Command::new(&plugin_path);
                if let Some(ref root) = dotnet_root {
                    cmd.env("DOTNET_ROOT", root);
                    if let Some(path_var) = std::env::var_os("PATH") {
                        let mut new_path = std::ffi::OsString::from(root);
                        new_path.push(";");
                        new_path.push(path_var);
                        cmd.env("PATH", new_path);
                    }
                }
                let login_id: u32 = rand::random();
                cmd.args([
                    "-app",
                    STEAM_APP_ID,
                    "-pubfile",
                    &pubfileid,
                    "-verify-all",
                    "-username",
                    &username,
                    "-password",
                    &password,
                    "-remember-password",
                    "-loginid",
                    &login_id.to_string(),
                    "-max-downloads",
                    "32",
                    "-dir",
                ])
                .arg(&output_dir_str)
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .kill_on_drop(true);

                #[cfg(windows)]
                {
                    const CREATE_NO_WINDOW: u32 = 0x0800_0000;
                    cmd.creation_flags(CREATE_NO_WINDOW);
                }

                let mut child = match cmd.spawn() {
                    Ok(c) => c,
                    Err(e) => {
                        let mut guard = tasks.lock();
                        if let Some(t) = guard.get_mut(&pubfileid) {
                            t.status = format!("Spawn error: {}", e);
                            t.phase = Phase::Failed;
                        }
                        break;
                    }
                };

                let stdout = child.stdout.take();
                let stderr = child.stderr.take();

                let child_holder = Arc::new(AsyncMutex::new(Some(child)));
                handles.lock().insert(pubfileid.clone(), child_holder.clone());

                let (tx, mut rx) = tokio::sync::mpsc::channel::<String>(100);

                if let Some(mut out) = stdout {
                    let tx = tx.clone();
                    tokio::spawn(async move {
                        let mut buf = [0u8; 1024];
                        let mut current_line = String::new();
                        while let Ok(n) = out.read(&mut buf).await {
                            if n == 0 {
                                break;
                            }
                            let chunk = String::from_utf8_lossy(&buf[..n]);
                            for c in chunk.chars() {
                                if c == '\n' {
                                    let line = std::mem::take(&mut current_line);
                                    let trimmed = line.trim_end_matches('\r');
                                    if !trimmed.is_empty() {
                                        let _ = tx.send(format!("OUT:{}", trimmed)).await;
                                    }
                                } else {
                                    current_line.push(c);
                                }
                            }
                        }
                        if !current_line.is_empty() {
                            let _ = tx.send(format!("OUT:{}", current_line)).await;
                        }
                    });
                }

                if let Some(err) = stderr {
                    let tx = tx.clone();
                    tokio::spawn(async move {
                        let mut reader = BufReader::new(err).lines();
                        while let Ok(Some(line)) = reader.next_line().await {
                            if !line.trim().is_empty() {
                                let _ = tx.send(format!("ERR:{}", line)).await;
                            }
                        }
                    });
                }
                drop(tx);

                let mut connection_failed = false;
                let start_time = tokio::time::Instant::now();
                let mut download_started = false;

                loop {
                    let current_timeout = if !download_started {
                        let elapsed = start_time.elapsed();
                        if elapsed >= std::time::Duration::from_secs(20) {
                            connection_failed = true;
                            break;
                        }
                        std::time::Duration::from_secs(20).saturating_sub(elapsed)
                    } else {
                        std::time::Duration::from_secs(86400)
                    };

                    match tokio::time::timeout(current_timeout, rx.recv()).await {
                        Ok(Some(msg)) => {
                            if let Some(line) = msg.strip_prefix("OUT:") {
                                let cleaned = line
                                    .replace(&format!("{}\\", output_dir_str), ": ")
                                    .replace(&format!("{}/", output_dir_str), ": ");
                                let progress = PROGRESS_RE
                                    .captures(&cleaned)
                                    .and_then(|c| c.get(1))
                                    .and_then(|m| m.as_str().replace(',', ".").parse::<f32>().ok())
                                    .map(|p| p.clamp(0.0, 100.0));

                                if progress.is_some() {
                                    download_started = true;
                                }

                                let mut guard = tasks.lock();
                                if let Some(t) = guard.get_mut(&pubfileid) {
                                    t.status = cleaned;
                                    t.phase = Phase::Running;
                                    if let Some(p) = progress {
                                        t.progress = Some(p);
                                    }
                                }
                            }
                        }
                        Ok(None) => break,
                        Err(_) => {
                            if !download_started {
                                connection_failed = true;
                            }
                            break;
                        }
                    }
                }

                let was_cancelled = cancelled.lock().contains(&pubfileid);
                let holder = handles.lock().remove(&pubfileid);
                let mut exit_ok = false;

                if let Some(holder) = holder {
                    let mut guard = holder.lock().await;
                    if let Some(child) = guard.as_mut() {
                        if connection_failed || was_cancelled {
                            let _ = child.kill().await;
                        }
                        if let Ok(st) = child.wait().await {
                            exit_ok = st.success();
                        }
                    }
                }

                if was_cancelled {
                    let mut guard = tasks.lock();
                    if let Some(t) = guard.get_mut(&pubfileid) {
                        t.status = "Cancelled".to_string();
                        t.phase = Phase::Cancelled;
                        t.progress = None;
                    }
                    cancelled.lock().remove(&pubfileid);
                    return;
                }

                let output_path = Path::new(&output_dir_str);
                let has_output = dir_has_files(output_path);
                let success = (exit_ok || has_output) && !connection_failed;

                if success {
                    let mut guard = tasks.lock();
                    if let Some(t) = guard.get_mut(&pubfileid) {
                        t.status = "Completed".to_string();
                        t.phase = Phase::Completed;
                        t.progress = Some(100.0);
                    }
                    return;
                }

                creds_idx += 1;
                if creds_idx >= total_creds {
                    let mut guard = tasks.lock();
                    if let Some(t) = guard.get_mut(&pubfileid) {
                        t.status = "Failed".to_string();
                        t.phase = Phase::Failed;
                    }
                    return;
                }

                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            }
        });

        Ok(())
    }

    pub async fn cancel(&self, pubfileid: &str, we_dir: &Path) -> bool {
        self.cancelled.lock().insert(pubfileid.to_string());

        let holder = self.handles.lock().remove(pubfileid);
        if let Some(holder) = holder {
            let mut guard = holder.lock().await;
            if let Some(child) = guard.as_mut() {
                let _ = child.kill().await;
            }
        }

        let mut guard = self.tasks.lock();
        if let Some(t) = guard.get_mut(pubfileid) {
            t.status = "Cancelled".to_string();
            t.phase = Phase::Cancelled;
            t.progress = None;
        }

        let folder = we_dir
            .join("projects")
            .join("myprojects")
            .join(pubfileid);
        if folder.exists() {
            let _ = std::fs::remove_dir_all(&folder);
        }

        true
    }
}

fn dir_has_files(dir: &Path) -> bool {
    let Ok(read) = std::fs::read_dir(dir) else {
        return false;
    };
    for entry in read.flatten() {
        if entry.file_type().map(|t| t.is_file()).unwrap_or(false) {
            return true;
        }
        if entry.file_type().map(|t| t.is_dir()).unwrap_or(false) && dir_has_files(&entry.path()) {
            return true;
        }
    }
    false
}
