use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::sync::Arc;

use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

use super::download::Phase;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractStatus {
    pub pubfileid: String,
    pub status: String,
    pub phase: Phase,
    pub progress: Option<f32>,
}

pub struct ExtractManager {
    tasks: Arc<Mutex<HashMap<String, ExtractStatus>>>,
}

impl ExtractManager {
    pub fn new() -> Self {
        Self {
            tasks: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn get(&self, pubfileid: &str) -> Option<ExtractStatus> {
        let lock = self.tasks.lock();
        if let Some(st) = lock.get(pubfileid) {
            return Some(st.clone());
        }
        let digits: String = pubfileid.chars().filter(|c| c.is_ascii_digit()).collect();
        if !digits.is_empty() {
            if let Some(st) = lock.get(&digits) {
                return Some(st.clone());
            }
        }
        None
    }

    pub fn clear(&self, pubfileid: &str) {
        self.tasks.lock().remove(pubfileid);
    }

    pub async fn start(
        &self,
        pubfileid: String,
        file_path: Option<PathBuf>,
        output_dir: Option<PathBuf>,
        we_dir: PathBuf,
        repkg_path: PathBuf,
        dotnet_root: Option<PathBuf>,
    ) -> anyhow::Result<()> {
        let task_id = if !pubfileid.trim().is_empty() {
            pubfileid.trim().to_string()
        } else if let Some(ref fp) = file_path {
            fp.to_string_lossy().to_string()
        } else {
            anyhow::bail!("No wallpaper identifier or file provided for extraction");
        };

        if !repkg_path.exists() {
            anyhow::bail!("RePKG.exe not found");
        }

        let find_pkg_in_dir = |dir: &Path| -> Option<PathBuf> {
            if let Ok(entries) = std::fs::read_dir(dir) {
                for entry in entries.flatten() {
                    let p = entry.path();
                    if p.is_file() {
                        if let Some(ext) = p.extension().and_then(|s| s.to_str()) {
                            if ext.eq_ignore_ascii_case("pkg") {
                                return Some(p);
                            }
                        }
                    }
                }
            }
            None
        };

        let mut pkg_file: Option<PathBuf> = None;
        let mut source_folder: Option<PathBuf> = None;

        if let Some(ref fp) = file_path {
            let full_p = if fp.is_absolute() {
                fp.clone()
            } else {
                we_dir.join(fp)
            };
            if full_p.is_file() {
                if let Some(ext) = full_p.extension().and_then(|s| s.to_str()) {
                    if ext.eq_ignore_ascii_case("pkg") {
                        pkg_file = Some(full_p.clone());
                        source_folder = full_p.parent().map(|p| p.to_path_buf());
                    }
                }
                if pkg_file.is_none() {
                    if let Some(parent) = full_p.parent() {
                        if let Some(pkg) = find_pkg_in_dir(parent) {
                            pkg_file = Some(pkg);
                            source_folder = Some(parent.to_path_buf());
                        }
                    }
                }
            } else if full_p.is_dir() {
                if let Some(pkg) = find_pkg_in_dir(&full_p) {
                    pkg_file = Some(pkg);
                    source_folder = Some(full_p);
                }
            }
        }

        if pkg_file.is_none() && !pubfileid.trim().is_empty() {
            let candidates = [
                we_dir.join("projects").join("myprojects").join(&pubfileid),
                we_dir.join("projects").join("defaultprojects").join(&pubfileid),
                we_dir.join("workshop").join("content").join("431960").join(&pubfileid),
            ];
            for cand in &candidates {
                if cand.exists() {
                    if let Some(pkg) = find_pkg_in_dir(cand) {
                        pkg_file = Some(pkg);
                        source_folder = Some(cand.clone());
                        break;
                    }
                }
            }
        }

        let Some(pkg_file) = pkg_file else {
            anyhow::bail!("No .pkg package found in this wallpaper (only scene wallpapers with .pkg can be unpacked)");
        };

        let subfolder_name = if !pubfileid.trim().is_empty() {
            pubfileid.trim().to_string()
        } else if let Some(ref fp) = file_path {
            let fp_str = fp.to_string_lossy();
            if let Some(caps) = regex::Regex::new(r"(\d{6,})").ok().and_then(|re| re.captures(&fp_str)) {
                caps.get(1).map(|m| m.as_str().to_string()).unwrap_or_else(|| "extracted".to_string())
            } else {
                fp.parent()
                    .and_then(|p| p.file_name())
                    .and_then(|n| n.to_str())
                    .unwrap_or("extracted")
                    .to_string()
            }
        } else {
            "extracted".to_string()
        };
        let extract_folder = if let Some(ref out) = output_dir {
            if !out.as_os_str().is_empty() {
                let target = out.join(&subfolder_name);
                let _ = std::fs::create_dir_all(&target);
                target
            } else {
                source_folder.unwrap_or_else(|| pkg_file.parent().unwrap().to_path_buf())
            }
        } else {
            source_folder.unwrap_or_else(|| pkg_file.parent().unwrap().to_path_buf())
        };

        let initial_status = ExtractStatus {
            pubfileid: task_id.clone(),
            status: "Extracting package...".to_string(),
            phase: Phase::Starting,
            progress: Some(0.0),
        };
        {
            let mut guard = self.tasks.lock();
            guard.insert(task_id.clone(), initial_status.clone());
            if !pubfileid.is_empty() {
                guard.insert(pubfileid.clone(), initial_status);
            }
        }

        let tasks = Arc::clone(&self.tasks);
        let task_id_owned = task_id.clone();
        let pubfileid_owned = pubfileid.clone();

        tokio::spawn(async move {
            let mut cmd = Command::new(repkg_path);
            if let Some(ref root) = dotnet_root {
                cmd.env("DOTNET_ROOT", root);
            }
            cmd.arg("extract")
                .arg("-c")
                .arg("-n")
                .arg("-o")
                .arg(&extract_folder)
                .arg(&pkg_file)
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
                    let update = |t: &mut ExtractStatus| {
                        t.status = format!("Spawn error: {}", e);
                        t.phase = Phase::Failed;
                    };
                    if let Some(t) = guard.get_mut(&task_id_owned) {
                        update(t);
                    }
                    if let Some(t) = guard.get_mut(&pubfileid_owned) {
                        update(t);
                    }
                    return;
                }
            };

            let stdout = child.stdout.take();
            if let Some(out) = stdout {
                let tasks_clone = Arc::clone(&tasks);
                let tid = task_id_owned.clone();
                let pid = pubfileid_owned.clone();
                tokio::spawn(async move {
                    let mut reader = BufReader::new(out).lines();
                    while let Ok(Some(line)) = reader.next_line().await {
                        let trimmed = line.trim();
                        if !trimmed.is_empty() {
                            let mut guard = tasks_clone.lock();
                            let update = |t: &mut ExtractStatus| {
                                t.status = trimmed.to_string();
                                t.phase = Phase::Running;
                            };
                            if let Some(t) = guard.get_mut(&tid) {
                                update(t);
                            }
                            if let Some(t) = guard.get_mut(&pid) {
                                update(t);
                            }
                        }
                    }
                });
            }

            let exit_ok = child.wait().await.map(|s| s.success()).unwrap_or(false);
            let has_files = dir_has_extracted_files(&extract_folder);
            let success = exit_ok || has_files;

            let mut guard = tasks.lock();
            let update = |t: &mut ExtractStatus| {
                if success {
                    t.status = "Extraction completed".to_string();
                    t.phase = Phase::Completed;
                    t.progress = Some(100.0);
                } else {
                    t.status = "Extraction failed".to_string();
                    t.phase = Phase::Failed;
                }
            };
            if let Some(t) = guard.get_mut(&task_id_owned) {
                update(t);
            }
            if let Some(t) = guard.get_mut(&pubfileid_owned) {
                update(t);
            }
        });

        Ok(())
    }
}

fn dir_has_extracted_files(dir: &Path) -> bool {
    let Ok(read) = std::fs::read_dir(dir) else {
        return false;
    };
    for entry in read.flatten() {
        if let Some(ext) = entry.path().extension().and_then(|s| s.to_str()) {
            if !ext.eq_ignore_ascii_case("pkg") {
                return true;
            }
        }
    }
    false
}
