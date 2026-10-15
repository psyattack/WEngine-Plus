use std::fs;
use std::io::{self, BufRead, Write};
use std::path::{Path, PathBuf};

const SCRIPTS_CONTENT: &str = include_str!("../scripts.js");

#[cfg(windows)]
fn setup_console() -> bool {
    use std::os::windows::io::IntoRawHandle;
    use windows_sys::Win32::System::Console::*;

    unsafe {
        let attached = AttachConsole(ATTACH_PARENT_PROCESS) != 0;
        let created = if !attached {
            AllocConsole() != 0
        } else {
            false
        };

        if let Ok(conout) = fs::OpenOptions::new().write(true).read(true).open("CONOUT$") {
            let handle = conout.into_raw_handle() as windows_sys::Win32::Foundation::HANDLE;
            SetStdHandle(STD_OUTPUT_HANDLE, handle);
            SetStdHandle(STD_ERROR_HANDLE, handle);
        }

        if created {
            if let Ok(conin) = fs::OpenOptions::new().read(true).open("CONIN$") {
                let handle = conin.into_raw_handle() as windows_sys::Win32::Foundation::HANDLE;
                SetStdHandle(STD_INPUT_HANDLE, handle);
            }
        }

        let title: Vec<u16> = "WEngine Plus - Setup\0".encode_utf16().collect();
        SetConsoleTitleW(title.as_ptr());

        created
    }
}

#[cfg(not(windows))]
fn setup_console() -> bool { false }

fn wait_for_enter(should_wait: bool) {
    if should_wait {
        println!("\nPress Enter to exit...");
        let stdin = io::stdin();
        let mut line = String::new();
        let _ = stdin.lock().read_line(&mut line);
    }
}

#[cfg(windows)]
fn query_reg_string(hkey: windows_sys::Win32::System::Registry::HKEY, subkey: &str, value_name: &str) -> Option<String> {
    use windows_sys::Win32::System::Registry::*;
    use windows_sys::Win32::Foundation::ERROR_SUCCESS;

    let subkey_w: Vec<u16> = subkey.encode_utf16().chain(std::iter::once(0)).collect();
    let val_w: Vec<u16> = value_name.encode_utf16().chain(std::iter::once(0)).collect();

    let mut key: HKEY = std::ptr::null_mut();
    unsafe {
        if RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ, &mut key) != ERROR_SUCCESS
            && RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ | KEY_WOW64_32KEY, &mut key) != ERROR_SUCCESS
            && RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ | KEY_WOW64_64KEY, &mut key) != ERROR_SUCCESS
        {
            return None;
        }

        let mut buf_len: u32 = 0;
        let mut val_type: u32 = 0;
        if RegQueryValueExW(key, val_w.as_ptr(), std::ptr::null_mut(), &mut val_type, std::ptr::null_mut(), &mut buf_len) != ERROR_SUCCESS {
            RegCloseKey(key);
            return None;
        }

        let mut buf = vec![0u8; buf_len as usize];
        if RegQueryValueExW(key, val_w.as_ptr(), std::ptr::null_mut(), &mut val_type, buf.as_mut_ptr(), &mut buf_len) != ERROR_SUCCESS {
            RegCloseKey(key);
            return None;
        }

        RegCloseKey(key);

        if val_type == REG_SZ || val_type == REG_EXPAND_SZ {
            let u16_slice = std::slice::from_raw_parts(buf.as_ptr() as *const u16, buf.len() / 2);
            let s = String::from_utf16_lossy(u16_slice);
            Some(s.trim_matches('\0').trim().to_string())
        } else {
            None
        }
    }
}

fn resolve_scripts_dir(path: &Path) -> Option<PathBuf> {
    if !path.exists() {
        return None;
    }
    // Direct folder containing scripts.js
    if path.join("scripts.js").exists() {
        return Some(path.to_path_buf());
    }
    // Standard Wallpaper Engine layout: <root>/ui/dist/scripts
    let sub_ui = path.join("ui").join("dist").join("scripts");
    if sub_ui.join("scripts.js").exists() {
        return Some(sub_ui);
    }
    let sub_dist = path.join("dist").join("scripts");
    if sub_dist.join("scripts.js").exists() {
        return Some(sub_dist);
    }
    let sub_scripts = path.join("scripts");
    if sub_scripts.join("scripts.js").exists() {
        return Some(sub_scripts);
    }
    None
}

fn find_wallpaper_engine_scripts() -> Option<PathBuf> {
    // 1. Running Wallpaper Engine process
    let mut sys = sysinfo::System::new();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
    for p in sys.processes().values() {
        let name = p.name().to_string_lossy().to_lowercase();
        if name == "wallpaper64.exe" || name == "wallpaper32.exe" {
            if let Some(exe_path) = p.exe() {
                if let Some(parent) = exe_path.parent() {
                    if let Some(res) = resolve_scripts_dir(parent) {
                        return Some(res);
                    }
                }
            }
        }
    }

    // 2. Windows Registry (Steam App 431960 Uninstall Key)
    #[cfg(windows)]
    {
        use windows_sys::Win32::System::Registry::*;
        let uninstall_subkeys = [
            r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 431960",
            r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 431960",
        ];
        for sub in &uninstall_subkeys {
            if let Some(loc) = query_reg_string(HKEY_LOCAL_MACHINE, sub, "InstallLocation") {
                if let Some(res) = resolve_scripts_dir(&PathBuf::from(loc)) {
                    return Some(res);
                }
            }
            if let Some(loc) = query_reg_string(HKEY_CURRENT_USER, sub, "InstallLocation") {
                if let Some(res) = resolve_scripts_dir(&PathBuf::from(loc)) {
                    return Some(res);
                }
            }
        }

        // Steam paths & libraryfolders.vdf
        let steam_subkeys = [
            (HKEY_CURRENT_USER, r"Software\Valve\Steam"),
            (HKEY_LOCAL_MACHINE, r"SOFTWARE\Valve\Steam"),
            (HKEY_LOCAL_MACHINE, r"SOFTWARE\WOW6432Node\Valve\Steam"),
        ];
        let mut steam_roots = Vec::new();
        for (hkey, sub) in &steam_subkeys {
            if let Some(p) = query_reg_string(*hkey, sub, "SteamPath") {
                steam_roots.push(PathBuf::from(p));
            }
            if let Some(p) = query_reg_string(*hkey, sub, "InstallPath") {
                steam_roots.push(PathBuf::from(p));
            }
        }
        for root in steam_roots {
            let cand = root.join("steamapps").join("common").join("wallpaper_engine");
            if let Some(res) = resolve_scripts_dir(&cand) {
                return Some(res);
            }
            let vdf_path = root.join("steamapps").join("libraryfolders.vdf");
            if vdf_path.exists() {
                if let Ok(content) = fs::read_to_string(&vdf_path) {
                    if let Ok(re) = regex::Regex::new(r#""path"\s+"([^"]+)""#) {
                        for cap in re.captures_iter(&content) {
                            if let Some(m) = cap.get(1) {
                                let lib_str = m.as_str().replace(r"\\", r"\");
                                let lib_cand = PathBuf::from(lib_str).join("steamapps").join("common").join("wallpaper_engine");
                                if let Some(res) = resolve_scripts_dir(&lib_cand) {
                                    return Some(res);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 3. Common directory locations across all drives
    let mut candidates = vec![
        PathBuf::from(r"C:\Program Files\Wallpaper Engine"),
        PathBuf::from(r"C:\Program Files (x86)\Wallpaper Engine"),
        PathBuf::from(r"C:\Program Files (x86)\Steam\steamapps\common\wallpaper_engine"),
        PathBuf::from(r"C:\Program Files\Steam\steamapps\common\wallpaper_engine"),
    ];
    for drive in b'C'..=b'Z' {
        let letter = drive as char;
        candidates.push(PathBuf::from(format!(r"{}:\SteamLibrary\steamapps\common\wallpaper_engine", letter)));
        candidates.push(PathBuf::from(format!(r"{}:\Steam\steamapps\common\wallpaper_engine", letter)));
        candidates.push(PathBuf::from(format!(r"{}:\Games\Steam\steamapps\common\wallpaper_engine", letter)));
        candidates.push(PathBuf::from(format!(r"{}:\Games\Wallpaper Engine", letter)));
        candidates.push(PathBuf::from(format!(r"{}:\Wallpaper Engine", letter)));
    }
    for cand in candidates {
        if let Some(res) = resolve_scripts_dir(&cand) {
            return Some(res);
        }
    }

    // 4. GUI Folder Browser Dialog fallback
    println!("[!] Wallpaper Engine folder was not detected automatically.");
    println!("[!] Opening folder picker dialog...");

    let ps_output = std::process::Command::new("powershell")
        .args([
            "-NoProfile",
            "-Command",
            "Add-Type -AssemblyName System.Windows.Forms; $d = New-Object Windows.Forms.FolderBrowserDialog; $d.Description = 'Select Wallpaper Engine folder (or ui\\dist\\scripts)'; $f = New-Object Windows.Forms.Form -Property @{TopMost=$true}; if ($d.ShowDialog($f) -eq 'OK') { Write-Output $d.SelectedPath }"
        ])
        .output();

    if let Ok(out) = ps_output {
        let selected = String::from_utf8_lossy(&out.stdout).trim().to_string();
        if !selected.is_empty() {
            if let Some(res) = resolve_scripts_dir(&PathBuf::from(selected)) {
                return Some(res);
            }
        }
    }

    // 5. Console fallback
    println!();
    println!("[?] Please enter the path to Wallpaper Engine (or ui\\dist\\scripts) manually:");
    print!("Path: ");
    let _ = io::stdout().flush();
    let mut input = String::new();
    if io::stdin().read_line(&mut input).is_ok() {
        let clean = input.trim().trim_matches('"').trim_matches('\'');
        if !clean.is_empty() {
            if let Some(res) = resolve_scripts_dir(&PathBuf::from(clean)) {
                return Some(res);
            }
        }
    }

    None
}

pub fn find_wallpaper_engine_dir() -> PathBuf {
    // 1. Running Wallpaper Engine process
    let mut sys = sysinfo::System::new();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
    for p in sys.processes().values() {
        let name = p.name().to_string_lossy().to_lowercase();
        if name == "wallpaper64.exe" || name == "wallpaper32.exe" {
            if let Some(exe_path) = p.exe() {
                if let Some(parent) = exe_path.parent() {
                    if parent.join("wallpaper64.exe").exists() || parent.join("wallpaper32.exe").exists() {
                        return parent.to_path_buf();
                    }
                }
            }
        }
    }

    // 2. Relative to current exe (e.g. ui/dist/scripts/../../..)
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(dir) = exe_path.parent() {
            if let Some(we) = dir.parent().and_then(|p| p.parent()).and_then(|p| p.parent()) {
                if we.join("wallpaper64.exe").exists() || we.join("wallpaper32.exe").exists() {
                    return we.to_path_buf();
                }
            }
        }
    }

    // 3. Steam Uninstall Key
    #[cfg(windows)]
    {
        use windows_sys::Win32::System::Registry::*;
        let uninstall_subkeys = [
            r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 431960",
            r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 431960",
        ];
        for sub in &uninstall_subkeys {
            if let Some(loc) = query_reg_string(HKEY_LOCAL_MACHINE, sub, "InstallLocation") {
                let p = PathBuf::from(loc);
                if p.join("wallpaper64.exe").exists() || p.join("wallpaper32.exe").exists() {
                    return p;
                }
            }
            if let Some(loc) = query_reg_string(HKEY_CURRENT_USER, sub, "InstallLocation") {
                let p = PathBuf::from(loc);
                if p.join("wallpaper64.exe").exists() || p.join("wallpaper32.exe").exists() {
                    return p;
                }
            }
        }
    }

    // 4. Common candidate paths
    let mut candidates = vec![
        PathBuf::from(r"C:\Program Files\Wallpaper Engine"),
        PathBuf::from(r"C:\Program Files (x86)\Wallpaper Engine"),
        PathBuf::from(r"C:\Program Files (x86)\Steam\steamapps\common\wallpaper_engine"),
        PathBuf::from(r"C:\Program Files\Steam\steamapps\common\wallpaper_engine"),
    ];
    for drive in b'C'..=b'Z' {
        let letter = drive as char;
        candidates.push(PathBuf::from(format!(r"{}:\SteamLibrary\steamapps\common\wallpaper_engine", letter)));
        candidates.push(PathBuf::from(format!(r"{}:\Steam\steamapps\common\wallpaper_engine", letter)));
        candidates.push(PathBuf::from(format!(r"{}:\Games\Steam\steamapps\common\wallpaper_engine", letter)));
        candidates.push(PathBuf::from(format!(r"{}:\Games\Wallpaper Engine", letter)));
        candidates.push(PathBuf::from(format!(r"{}:\Wallpaper Engine", letter)));
    }
    for cand in candidates {
        if cand.join("wallpaper64.exe").exists() || cand.join("wallpaper32.exe").exists() {
            return cand;
        }
    }

    PathBuf::from(r"C:\Program Files\Wallpaper Engine")
}

fn kill_other_helper_instances() {
    let mut sys = sysinfo::System::new();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
    let my_pid = sysinfo::get_current_pid().ok();

    for (pid, p) in sys.processes() {
        if Some(*pid) == my_pid {
            continue;
        }
        let name = p.name().to_string_lossy().to_lowercase();
        if name.contains("wengine-helper") {
            p.kill();
        }
    }
    std::thread::sleep(std::time::Duration::from_millis(200));
}

pub fn run_setup_mode(silent: bool) {
    let is_new_window = if !silent { setup_console() } else { false };
    let should_wait = !silent && is_new_window;

    if !silent {
        println!();
        println!("==============================================================");
        println!("                     WEngine Plus - Setup                     ");
        println!("==============================================================");
        println!();
    }

    let exe_path = std::env::current_exe().unwrap_or_else(|_| PathBuf::from("wengine-helper.exe"));
    let exe_dir = exe_path.parent().map(|p| p.to_path_buf()).unwrap_or_else(|| PathBuf::from("."));
    let current_dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));

    // 1. Locate target scripts directory
    if !silent {
        println!("[1/3] Locating Wallpaper Engine scripts directory...");
    }

    let target_dir = if exe_dir.join("scripts.js").exists() {
        // Fast path: already located directly in the scripts directory!
        exe_dir.clone()
    } else if current_dir.join("scripts.js").exists() && (exe_dir.ends_with("release") || exe_dir.ends_with("debug")) {
        // Development environment
        current_dir.clone()
    } else {
        // Auto-discover via processes, registry, VDF, and disks
        match find_wallpaper_engine_scripts() {
            Some(dir) => dir,
            None => {
                if !silent {
                    println!();
                    println!("[-] ERROR: Could not locate Wallpaper Engine scripts directory.");
                    println!("    Please manually place wengine-helper.exe into:");
                    println!(r"    <Wallpaper Engine>\ui\dist\scripts\");
                    wait_for_enter(should_wait);
                }
                std::process::exit(1);
            }
        }
    };

    if !silent {
        println!("[+] Target directory: {}", target_dir.display());
        println!("[2/3] Installing wengine-helper daemon...");
    }

    // 2. Wait for wallpaperui to close if running in silent mode (e.g. during auto-update)
    if silent {
        let mut sys = sysinfo::System::new();
        for _ in 0..20 {
            sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
            let has_ui = sys.processes().values().any(|p| {
                let name = p.name().to_string_lossy().to_lowercase();
                name == "wallpaperui.exe" || name == "wallpaperui"
            });
            if !has_ui {
                break;
            }
            std::thread::sleep(std::time::Duration::from_millis(250));
        }

        // Force-terminate any lingering wallpaperui processes if still alive
        sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
        for p in sys.processes().values() {
            let name = p.name().to_string_lossy().to_lowercase();
            if name == "wallpaperui.exe" || name == "wallpaperui" {
                p.kill();
            }
        }
        std::thread::sleep(std::time::Duration::from_millis(200));
    }

    // Terminate any other helper daemon instances (except ourselves)
    kill_other_helper_instances();

    // 3. Synchronize binary into target directory
    let target_exe = target_dir.join("wengine-helper.exe");

    let is_already_installed = if let (Ok(src_can), Ok(tgt_can)) = (exe_path.canonicalize(), target_exe.canonicalize()) {
        src_can == tgt_can
    } else {
        exe_path == target_exe
    };

    if !is_already_installed {
        if let Err(e) = fs::copy(&exe_path, &target_exe) {
            if e.kind() == std::io::ErrorKind::PermissionDenied {
                if !silent {
                    println!("[!] Administrator permissions required to write to target directory.");
                    println!("[!] Requesting elevation...");
                }
                let arg = if silent { " -ArgumentList '--silent'" } else { "" };
                let _ = std::process::Command::new("powershell")
                    .args([
                        "-NoProfile",
                        "-Command",
                        &format!("Start-Process -FilePath '{}'{} -Verb RunAs", exe_path.display(), arg)
                    ])
                    .status();
                std::process::exit(0);
            } else {
                if !silent {
                    println!("[-] ERROR copying binary: {}", e);
                    wait_for_enter(should_wait);
                }
                std::process::exit(1);
            }
        }
        if !silent {
            println!("[+] Binary installed to: {}", target_exe.display());
        }

        // Schedule deletion of original source binary upon exit
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            let pid = std::process::id();
            let escaped_path = exe_path.to_string_lossy().replace('\'', "''");
            let ps_script = format!(
                "$p = Get-Process -Id {} -ErrorAction SilentlyContinue; if ($p) {{ $p.WaitForExit(120000) }}; for ($i = 0; $i -lt 30; $i++) {{ Start-Sleep -Milliseconds 250; try {{ [System.IO.File]::Delete('{}'); break }} catch {{}} }}",
                pid, escaped_path
            );

            let mut cmd = std::process::Command::new("powershell");
            cmd.args(["-NoProfile", "-WindowStyle", "Hidden", "-Command", &ps_script]);
            cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
            let _ = cmd.spawn();
        }
    } else if !silent {
        println!("[*] Binary is already installed in target directory.");
    }

    // 4. Install scripts.js
    if !silent {
        println!("[3/3] Installing scripts.js...");
    }
    let target_scripts = target_dir.join("scripts.js");
    let existing_content = fs::read_to_string(&target_scripts).unwrap_or_default();

    // Create safety backup once if not already present
    let backup_path = target_scripts.with_file_name("scripts.js.bak");
    if !backup_path.exists() && !existing_content.is_empty() {
        if !silent {
            print!("[*] Creating backup ({}) ... ", backup_path.file_name().unwrap_or_default().to_string_lossy());
        }
        let _ = fs::write(&backup_path, existing_content.as_bytes());
        if !silent {
            println!("OK");
        }
    }

    // Write updated scripts.js (retry loop in case of brief file lock)
    if !silent {
        print!("[*] Writing updated scripts.js ... ");
    }
    let mut written = false;
    for _ in 0..10 {
        if fs::write(&target_scripts, SCRIPTS_CONTENT.as_bytes()).is_ok() {
            written = true;
            break;
        }
        std::thread::sleep(std::time::Duration::from_millis(200));
    }
    if !silent {
        if written { println!("OK"); } else { println!("FAILED"); }
    }

    // 5. Clean up temporary files (.update and .old)
    let update_file = target_dir.join("wengine-helper.exe.update");
    if update_file.exists() {
        let _ = fs::remove_file(&update_file);
    }
    let old_exe = target_dir.join("wengine-helper.exe.old");
    if old_exe.exists() {
        let mut deleted = false;
        for _ in 0..30 {
            if fs::remove_file(&old_exe).is_ok() || !old_exe.exists() {
                deleted = true;
                break;
            }
            std::thread::sleep(std::time::Duration::from_millis(150));
        }
        if !deleted && old_exe.exists() {
            #[cfg(windows)]
            {
                use std::os::windows::process::CommandExt;
                let escaped = old_exe.to_string_lossy().replace('\'', "''");
                let _ = std::process::Command::new("powershell")
                    .args([
                        "-NoProfile",
                        "-WindowStyle", "Hidden",
                        "-Command",
                        &format!("Start-Sleep -Seconds 1; Remove-Item -Force -LiteralPath '{}' -ErrorAction SilentlyContinue", escaped),
                    ])
                    .creation_flags(0x08000000)
                    .spawn();
            }
        }
    }

    // 6. Spawn daemon process in background
    let helper_exe = target_dir.join("wengine-helper.exe");
    if helper_exe.exists() {
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            let mut cmd = std::process::Command::new(&helper_exe);
            cmd.arg("--daemon");
            cmd.current_dir(&target_dir);
            cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
            let _ = cmd.spawn();
        }
        #[cfg(not(windows))]
        {
            let _ = std::process::Command::new(&helper_exe).arg("--daemon").spawn();
        }
    }

    // 7. If silent (auto-update or automated setup), reopen GUI
    if silent {
        let we_dir = find_wallpaper_engine_dir();
        let we_exe = if we_dir.join("wallpaper64.exe").exists() {
            Some(we_dir.join("wallpaper64.exe"))
        } else if we_dir.join("wallpaper32.exe").exists() {
            Some(we_dir.join("wallpaper32.exe"))
        } else if we_dir.join("launcher.exe").exists() {
            Some(we_dir.join("launcher.exe"))
        } else {
            None
        };

        if let Some(exe) = we_exe {
            std::thread::sleep(std::time::Duration::from_millis(600));
            #[cfg(windows)]
            {
                let mut cmd = std::process::Command::new(&exe);
                cmd.current_dir(&we_dir);
                if cmd.spawn().is_err() {
                    let escaped = exe.to_string_lossy().replace('\'', "''");
                    let escaped_dir = we_dir.to_string_lossy().replace('\'', "''");
                    let _ = std::process::Command::new("powershell")
                        .args([
                            "-NoProfile",
                            "-Command",
                            &format!("Start-Process -FilePath '{}' -WorkingDirectory '{}'", escaped, escaped_dir),
                        ])
                        .spawn();
                }
            }
            #[cfg(not(windows))]
            {
                let _ = std::process::Command::new(&exe).current_dir(&we_dir).spawn();
            }
        }

        std::process::exit(0);
    }

    // 8. Completion for interactive setup
    println!();
    println!("==============================================================");
    println!("[SUCCESS] WEngine Plus successfully installed and ready!       ");
    println!("==============================================================");
    println!("[*] You can now launch Wallpaper Engine normally.");
    if !is_already_installed {
        println!("[*] Temporary installer will be cleaned up upon exit.");
    }

    wait_for_enter(should_wait);
    std::process::exit(0);
}
