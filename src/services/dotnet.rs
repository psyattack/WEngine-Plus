//! .NET Runtime management for DepotDownloaderMod and RePKG plugins.
//!
//! Checks if .NET 8/9/10 is installed in the system. If not found, downloads
//! the portable .NET 9.0.17 runtime, extracts it to the directory alongside
//! the script (`dotnet/`), and sets DOTNET_ROOT environment variable.

use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

use parking_lot::RwLock;
use serde::Serialize;

pub const DOTNET_RUNTIME_URL: &str =
    "https://builds.dotnet.microsoft.com/dotnet/Runtime/9.0.17/dotnet-runtime-9.0.17-win-x64.zip";
pub const DOTNET_RUNTIME_VERSION: &str = "9.0.17";

#[derive(Debug, Clone, Serialize)]
pub struct DotnetStatus {
    pub phase: DotnetPhase,
    pub message: String,
    pub progress: Option<f32>,
}

#[derive(Debug, Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum DotnetPhase {
    Checking,
    Downloading,
    Extracting,
    Ready,
    Error,
}

pub struct DotnetManager {
    base_dir: PathBuf,
    status: Arc<RwLock<DotnetStatus>>,
    is_working: Arc<AtomicBool>,
}

impl DotnetManager {
    pub fn new(base_dir: PathBuf) -> Self {
        let is_sys = is_system_dotnet_installed();
        let dotnet_dir = base_dir.join("dotnet");
        let is_port = is_portable_runtime_valid(&dotnet_dir);
        let ready = is_sys || is_port;

        let status = DotnetStatus {
            phase: if ready {
                DotnetPhase::Ready
            } else {
                DotnetPhase::Checking
            },
            message: if is_sys {
                "System .NET Runtime 8/9/10 found".to_string()
            } else if is_port {
                "Portable .NET Runtime ready".to_string()
            } else {
                ".NET Runtime needs installation".to_string()
            },
            progress: if ready { Some(100.0) } else { None },
        };

        Self {
            base_dir,
            status: Arc::new(RwLock::new(status)),
            is_working: Arc::new(AtomicBool::new(false)),
        }
    }

    /// Returns the path to use for DOTNET_ROOT. If .NET 8/9/10 is installed
    /// in the system, returns None (use system runtime). Otherwise, returns
    /// the portable runtime path if it exists.
    pub fn get_dotnet_root(&self) -> Option<PathBuf> {
        if is_system_dotnet_installed() {
            return None;
        }
        let dotnet_dir = self.base_dir.join("dotnet");
        if is_portable_runtime_valid(&dotnet_dir) {
            Some(dotnet_dir)
        } else {
            None
        }
    }

    pub fn is_ready(&self) -> bool {
        is_system_dotnet_installed() || is_portable_runtime_valid(&self.base_dir.join("dotnet"))
    }

    pub fn get_status(&self) -> DotnetStatus {
        let mut st = self.status.read().clone();
        if !self.is_working.load(Ordering::SeqCst)
            && !matches!(st.phase, DotnetPhase::Downloading | DotnetPhase::Extracting)
        {
            if self.is_ready() {
                st.phase = DotnetPhase::Ready;
                st.progress = Some(100.0);
            }
        }
        st
    }

    pub fn start_ensure(self: &Arc<Self>) {
        if self.is_ready() {
            return;
        }
        if self.is_working.swap(true, Ordering::SeqCst) {
            return;
        }

        let mgr = Arc::clone(self);
        tokio::spawn(async move {
            let res = mgr.run_ensure().await;
            mgr.is_working.store(false, Ordering::SeqCst);
            let mut guard = mgr.status.write();
            match res {
                Ok(_) => {
                    guard.phase = DotnetPhase::Ready;
                    guard.message = "Portable .NET Runtime installed".to_string();
                    guard.progress = Some(100.0);
                }
                Err(e) => {
                    guard.phase = DotnetPhase::Error;
                    guard.message = format!("Failed to install .NET Runtime: {}", e);
                    guard.progress = None;
                }
            }
        });
    }

    pub async fn run_ensure(&self) -> anyhow::Result<Option<PathBuf>> {
        // If system runtime is present, nothing to download
        if is_system_dotnet_installed() {
            let mut guard = self.status.write();
            guard.phase = DotnetPhase::Ready;
            guard.message = "System .NET Runtime 8/9/10 found".to_string();
            guard.progress = Some(100.0);
            return Ok(None);
        }

        let dotnet_dir = self.base_dir.join("dotnet");
        if is_portable_runtime_valid(&dotnet_dir) {
            let mut guard = self.status.write();
            guard.phase = DotnetPhase::Ready;
            guard.message = "Portable .NET Runtime ready".to_string();
            guard.progress = Some(100.0);
            return Ok(Some(dotnet_dir));
        }

        let zip_path = self.base_dir.join("dotnet-runtime.zip");
        std::fs::create_dir_all(&self.base_dir)?;

        {
            let mut guard = self.status.write();
            guard.phase = DotnetPhase::Downloading;
            guard.message = format!("Downloading .NET Runtime {} portable...", DOTNET_RUNTIME_VERSION);
            guard.progress = Some(0.0);
        }

        let client = reqwest::Client::builder()
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            .build()?;

        let response = client.get(DOTNET_RUNTIME_URL).send().await?;
        if !response.status().is_success() {
            anyhow::bail!("Failed to download .NET Runtime: HTTP {}", response.status());
        }

        let total_size = response.content_length().unwrap_or(0);
        let bytes = response.bytes().await?;
        std::fs::write(&zip_path, &bytes)?;

        let progress = if total_size > 0 {
            (bytes.len() as f32 / total_size as f32) * 100.0
        } else {
            100.0
        };

        {
            let mut guard = self.status.write();
            guard.phase = DotnetPhase::Extracting;
            guard.message = format!("Extracting .NET Runtime ({:.1} MB)...", bytes.len() as f32 / 1_048_576.0);
            guard.progress = Some(progress);
        }

        extract_zip(&zip_path, &dotnet_dir)?;
        let _ = std::fs::remove_file(&zip_path);

        {
            let mut guard = self.status.write();
            guard.phase = DotnetPhase::Ready;
            guard.message = "Portable .NET Runtime ready".to_string();
            guard.progress = Some(100.0);
        }

        Ok(Some(dotnet_dir))
    }
}

/// Checks if .NET 8, 9, or 10 is installed by running `dotnet --list-runtimes`.
pub fn is_system_dotnet_installed() -> bool {
    let mut cmd = Command::new("dotnet");
    cmd.arg("--list-runtimes");

    #[cfg(windows)]
    {
        const CREATE_NO_WINDOW: u32 = 0x0800_0000;
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }

    let Ok(output) = cmd.output() else {
        return false;
    };

    if !output.status.success() {
        return false;
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    for line in stdout.lines() {
        if line.contains("Microsoft.NETCore.App")
            && (line.contains(" 8.") || line.contains(" 9.") || line.contains(" 10."))
        {
            return true;
        }
    }

    false
}

/// Checks if the portable runtime directory exists and looks valid.
pub fn is_portable_runtime_valid(dotnet_dir: &Path) -> bool {
    if !dotnet_dir.exists() {
        return false;
    }
    let dotnet_exe = dotnet_dir.join("dotnet.exe");
    dotnet_exe.exists()
}

/// Extracts a ZIP archive to the target directory.
fn extract_zip(zip_path: &Path, target_dir: &Path) -> anyhow::Result<()> {
    let file = std::fs::File::open(zip_path)?;
    let mut archive = zip::ZipArchive::new(file)?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        let outpath = match file.enclosed_name() {
            Some(path) => target_dir.join(path),
            None => continue,
        };

        if file.name().ends_with('/') {
            std::fs::create_dir_all(&outpath)?;
        } else {
            if let Some(p) = outpath.parent() {
                std::fs::create_dir_all(p)?;
            }
            let mut outfile = std::fs::File::create(&outpath)?;
            std::io::copy(&mut file, &mut outfile)?;
        }
    }

    Ok(())
}
