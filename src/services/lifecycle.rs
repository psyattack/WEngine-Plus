use std::sync::atomic::{AtomicBool, AtomicI64, Ordering};
use std::sync::Arc;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

#[cfg(windows)]
use windows_sys::Win32::Foundation::{CloseHandle, HANDLE};
#[cfg(windows)]
use windows_sys::Win32::System::Threading::{OpenProcess, WaitForSingleObject, PROCESS_SYNCHRONIZE};

use sysinfo::{ProcessesToUpdate, System};

pub struct LifecycleManager {
    last_heartbeat: Arc<AtomicI64>,
    heartbeat_enabled: Arc<AtomicBool>,
}

impl LifecycleManager {
    pub fn new() -> Self {
        let last_heartbeat = Arc::new(AtomicI64::new(now_sec()));
        let heartbeat_enabled = Arc::new(AtomicBool::new(false));

        // Start process watcher in background
        start_wallpaperui_watcher();

        // Start heartbeat checker in background
        {
            let hb = last_heartbeat.clone();
            let en = heartbeat_enabled.clone();
            tokio::spawn(async move {
                loop {
                    tokio::time::sleep(Duration::from_secs(3)).await;
                    if en.load(Ordering::SeqCst) {
                        let diff = now_sec() - hb.load(Ordering::SeqCst);
                        if diff > 15 {
                            eprintln!("[Lifecycle] Heartbeat lost for {diff}s, shutting down...");
                            std::process::exit(0);
                        }
                    }
                }
            });
        }

        Self {
            last_heartbeat,
            heartbeat_enabled,
        }
    }

    pub fn touch_heartbeat(&self) {
        self.last_heartbeat.store(now_sec(), Ordering::SeqCst);
        self.heartbeat_enabled.store(true, Ordering::SeqCst);
    }
}

fn now_sec() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs() as i64
}

pub static IS_UPDATING: AtomicBool = AtomicBool::new(false);

fn start_wallpaperui_watcher() {
    std::thread::spawn(|| {
        let mut sys = System::new();
        // Wait up to 10 seconds for wallpaperui.exe to be present
        let mut target_pid = None;
        for _ in 0..20 {
            sys.refresh_processes(ProcessesToUpdate::All, true);
            for (pid, proc) in sys.processes() {
                let name = proc.name().to_string_lossy().to_lowercase();
                if name == "wallpaperui.exe" || name == "wallpaperui" {
                    target_pid = Some(pid.as_u32());
                    break;
                }
            }
            if target_pid.is_some() {
                break;
            }
            std::thread::sleep(Duration::from_millis(500));
        }

        #[cfg(windows)]
        if let Some(pid) = target_pid {
            println!("[Lifecycle] Attached to wallpaperui.exe with PID {pid}");
            unsafe {
                let handle: HANDLE = OpenProcess(PROCESS_SYNCHRONIZE, 0, pid);
                if !handle.is_null() {
                    WaitForSingleObject(handle, 0xFFFFFFFF); // INFINITE
                    CloseHandle(handle);
                    if IS_UPDATING.load(Ordering::SeqCst) {
                        println!("[Lifecycle] wallpaperui.exe closed, but update is underway. Not terminating worker.");
                        return;
                    }
                    println!("[Lifecycle] wallpaperui.exe closed! Terminating worker...");
                    std::process::exit(0);
                }
            }
        }
    });
}
