use std::fs;
use std::io::{self, BufRead, Write};
use std::path::{Path, PathBuf};

const OVERLAY_CONTENT: &str = include_str!("../frontend/wengine-plus.js");
/// One-line loader appended to the pristine frontend. The overlay path is
/// resolved relative to the UI document (`ui/dist/index.html`), and
/// `</script>` is escaped so the line is safe if the base is ever inlined.
const OVERLAY_LOADER: &str =
    "document.write('<script src=\"scripts/wengine-plus.js\"><\\/script>');\n";
const OVERLAY_FILE: &str = "wengine-plus.js";

/// Strings that only appear in a WEngine-Plus-patched frontend.
const WEP_MARKERS: [&str; 4] = ["WengineHelper", "WEP_API_TOKEN", "WEP_LOCALES", "wengine-plus.js"];

fn has_wep_markers(content: &str) -> bool {
    WEP_MARKERS.iter().any(|marker| content.contains(marker))
}

/// Returns the pristine Wallpaper Engine frontend to patch: the installed
/// `scripts.js` when a Wallpaper Engine update replaced it, otherwise the
/// safety backup.
fn resolve_pristine_base(target_dir: &Path) -> Result<PathBuf, String> {
    let current = target_dir.join("scripts.js");
    match fs::read_to_string(&current) {
        Ok(content) if !has_wep_markers(&content) => return Ok(current),
        Ok(_) => {}
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
        Err(e) => return Err(format!("cannot read scripts.js: {e}")),
    }

    let backup = target_dir.join("scripts.js.bak");
    if backup.exists() {
        if let Ok(content) = fs::read_to_string(&backup) {
            if !has_wep_markers(&content) {
                return Ok(backup);
            }
        }
    }

    Err("scripts.js is already patched and no pristine scripts.js.bak is available".to_string())
}

/// Removes the overlay loader (and the newline that separated it from the base)
/// so an installed file round-trips byte-exactly to the pristine one.
fn strip_overlay_loader(content: &str) -> String {
    let Some(idx) = content.rfind("scripts/wengine-plus.js") else {
        return content.to_string();
    };
    let line_start = content[..idx].rfind('\n').map(|p| p + 1).unwrap_or(0);
    let mut start = line_start;
    if start > 0 {
        start -= 1; // the '\n' in front of the loader
        if start > 0 && content.as_bytes()[start - 1] == b'\r' {
            start -= 1;
        }
    }
    let line_end = content[idx..]
        .find('\n')
        .map(|p| idx + p + 1)
        .unwrap_or(content.len());

    let mut out = String::with_capacity(content.len());
    out.push_str(&content[..start]);
    out.push_str(&content[line_end..]);
    out
}

/// Appends the one-line overlay loader on its own line, keeping the base line
/// ending style and never adding it twice. The loader is the last line and has
/// no trailing newline, which makes [`strip_overlay_loader`] exact.
fn with_overlay_loader(mut base: String) -> String {
    if base.contains("scripts/wengine-plus.js") {
        return base;
    }
    let eol = if base.contains("\r\n") { "\r\n" } else { "\n" };
    let loader_line = OVERLAY_LOADER.trim_end_matches(['\r', '\n']);
    base.push_str(eol);
    base.push_str(loader_line);
    base
}

static VDF_PATH_RE: once_cell::sync::Lazy<regex::Regex> = once_cell::sync::Lazy::new(|| {
    regex::Regex::new(r#""path"\s+"([^"]+)""#).expect("vdf path regex")
});

static WE_VERSION_RE: once_cell::sync::Lazy<regex::Regex> = once_cell::sync::Lazy::new(|| {
    regex::Regex::new(r#""version"\s*:\s*"([^"]+)""#).expect("we version regex")
});

/// Wallpaper Engine version this patch was built and tested against.
pub const BUILT_FOR_WE_VERSION: &str = "2.8.42";

/// Reads `<WE>\version.json`.
pub fn detect_we_version(we_dir: &Path) -> Option<String> {
    let raw = fs::read_to_string(we_dir.join("version.json")).ok()?;
    WE_VERSION_RE.captures(&raw).map(|caps| caps[1].to_string())
}

/// Returns the per-install API token, reusing the one written by a previous
/// install so an auto-update does not invalidate the running UI.
fn ensure_api_token(target_dir: &Path) -> String {
    let token_path = target_dir.join("wengine-token");
    if let Ok(raw) = fs::read_to_string(&token_path) {
        let token = raw.trim();
        if token.len() >= 32 && token.len() <= 128 && token.chars().all(|c| c.is_ascii_hexdigit()) {
            return token.to_string();
        }
    }

    use rand::RngExt;
    let mut rng = rand::rng();
    let mut token = String::with_capacity(48);
    for _ in 0..48 {
        token.push(char::from_digit(rng.random_range(0..16), 16).expect("hex digit"));
    }
    let _ = fs::write(&token_path, &token);
    token
}

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
    if let Ok(mut sys) = sysinfo::System::new() {
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
                    for cap in VDF_PATH_RE.captures_iter(&content) {
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
    if let Ok(mut sys) = sysinfo::System::new() {
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
    let Ok(mut sys) = sysinfo::System::new() else {
        return;
    };
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

    // A patched scripts.js is tied to the UI build it was derived from; warn
    // instead of silently installing a patch for another version.
    if let Some(version) = target_dir.ancestors().nth(3).and_then(detect_we_version) {
        if version != BUILT_FOR_WE_VERSION && !silent {
            println!("[!] Wallpaper Engine {version} detected; this build targets {BUILT_FOR_WE_VERSION}.");
            println!("    The patched frontend may not match the current UI build.");
        } else if !silent {
            println!("[+] Wallpaper Engine version: {version}");
        }
    }

    // 2. Wait for wallpaperui to close if running in silent mode (e.g. during auto-update)
    if silent {
        if let Ok(mut sys) = sysinfo::System::new() {
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

    // Write the base and the overlay with the per-install API token (retry loop
    // in case of a brief file lock).
    if !silent {
        print!("[*] Writing updated scripts.js ... ");
    }
    let api_token = ensure_api_token(&target_dir);

    // The base always comes from the pristine Wallpaper Engine frontend: the
    // backup created above, or the installed scripts.js when it is untouched.
    let base_path = match resolve_pristine_base(&target_dir) {
        Ok(path) => path,
        Err(e) => {
            if !silent {
                println!("[-] ERROR: {e}");
                println!("    Restore scripts.js via Steam (Verify integrity) and run setup again.");
                wait_for_enter(should_wait);
            }
            std::process::exit(1);
        }
    };
    let base_source = match fs::read_to_string(&base_path) {
        Ok(content) => content,
        Err(e) => {
            if !silent {
                println!("[-] ERROR: cannot read {}: {e}", base_path.display());
                wait_for_enter(should_wait);
            }
            std::process::exit(1);
        }
    };

    let scripts_content = with_overlay_loader(
        base_source.replace(crate::api_security::TOKEN_PLACEHOLDER, &api_token),
    );

    let written = write_with_retries(&target_scripts, scripts_content.as_bytes());
    if !silent {
        if written { println!("OK"); } else { println!("FAILED"); }
    }

    if !silent {
        print!("[*] Writing {OVERLAY_FILE} ... ");
    }
    let overlay_content =
        OVERLAY_CONTENT.replace(crate::api_security::TOKEN_PLACEHOLDER, &api_token);
    let target_overlay = target_dir.join(OVERLAY_FILE);
    let overlay_written = write_with_retries(&target_overlay, overlay_content.as_bytes());
    if !silent {
        if overlay_written { println!("OK"); } else { println!("FAILED"); }
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

pub fn run_uninstall(silent: bool) {
    let is_new_window = if !silent { setup_console() } else { false };
    let should_wait = !silent && is_new_window;

    let exe_path = std::env::current_exe().unwrap_or_else(|_| PathBuf::from("wengine-helper.exe"));
    let exe_dir = exe_path
        .parent()
        .map(|p| p.to_path_buf())
        .unwrap_or_else(|| PathBuf::from("."));
    let current_dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));

    let target_dir = if exe_dir.join("scripts.js").exists() {
        exe_dir.clone()
    } else if current_dir.join("scripts.js").exists()
        && (exe_dir.ends_with("release") || exe_dir.ends_with("debug"))
    {
        current_dir.clone()
    } else {
        match find_wallpaper_engine_scripts() {
            Some(dir) => dir,
            None => {
                if !silent {
                    println!("[-] ERROR: Could not locate Wallpaper Engine scripts directory.");
                    wait_for_enter(should_wait);
                }
                std::process::exit(1);
            }
        }
    };

    if !silent {
        println!();
        println!("==============================================================");
        println!("                    WEngine Plus - Uninstall                  ");
        println!("==============================================================");
        println!();
        println!("[+] Target directory: {}", target_dir.display());
        println!("[*] Stopping helper instances...");
    }

    kill_other_helper_instances();

    // 1. Restore the pristine frontend. A Wallpaper Engine update replaces
    // scripts.js with a new pristine file, so prefer stripping our one line over
    // restoring an older backup.
    let scripts = target_dir.join("scripts.js");
    let backup = target_dir.join("scripts.js.bak");
    let mut restored = false;

    if let Ok(current) = fs::read_to_string(&scripts) {
        let stripped = strip_overlay_loader(&current);
        if stripped.len() != current.len() && !has_wep_markers(&stripped) {
            for _ in 0..15 {
                if fs::write(&scripts, stripped.as_bytes()).is_ok() {
                    restored = true;
                    break;
                }
                std::thread::sleep(std::time::Duration::from_millis(200));
            }
            if restored && !silent {
                println!("[+] Removed the overlay loader from scripts.js");
            }
        }
    }

    if !restored && backup.exists() {
        for _ in 0..15 {
            if fs::copy(&backup, &scripts).is_ok() {
                restored = true;
                break;
            }
            std::thread::sleep(std::time::Duration::from_millis(200));
        }
        if restored && !silent {
            println!("[+] Restored the original scripts.js");
        } else if !silent {
            println!("[-] Could not restore scripts.js (file is locked); backup kept.");
        }
    }

    if restored {
        let _ = fs::remove_file(&backup);
    } else if !silent {
        println!("[!] Could not determine a pristine scripts.js; leaving the current file untouched.");
    }

    // 2. Remove everything WEngine-Plus owns inside the scripts directory.
    let files = [
        "wengine-helper.exe.old",
        "wengine-helper.exe.update",
        "wengine-plus.js",
        "wengine-token",
        "wengine-helper.log",
        "metadata.json",
        "steam_session.json",
        "download_accounts.json",
    ];
    for name in files {
        let path = target_dir.join(name);
        if path.exists() && remove_with_retries(&path).is_ok() && !silent {
            println!("[-] Removed {name}");
        }
    }
    for dir in ["plugins", "dotnet"] {
        let path = target_dir.join(dir);
        if path.exists() {
            let _ = fs::remove_dir_all(&path);
            if !silent {
                println!("[-] Removed {dir}/");
            }
        }
    }

    // 3. A running executable cannot delete itself on Windows: rename/remove the
    // helper image after this process exits.
    let self_exe = target_dir.join("wengine-helper.exe");
    if self_exe.exists() {
        schedule_self_delete(&self_exe, std::process::id());
    }

    if !silent {
        println!();
        println!("[SUCCESS] WEngine Plus has been uninstalled.");
        wait_for_enter(should_wait);
    }
    std::process::exit(0);
}

fn write_with_retries(path: &Path, bytes: &[u8]) -> bool {
    for _ in 0..10 {
        if fs::write(path, bytes).is_ok() {
            return true;
        }
        std::thread::sleep(std::time::Duration::from_millis(200));
    }
    false
}

fn remove_with_retries(path: &Path) -> io::Result<()> {
    let mut last = Ok(());
    for _ in 0..10 {
        match fs::remove_file(path) {
            Ok(()) => return Ok(()),
            Err(e) => last = Err(e),
        }
        std::thread::sleep(std::time::Duration::from_millis(200));
    }
    last
}

fn schedule_self_delete(exe: &Path, pid: u32) {
    let escaped = exe.to_string_lossy().replace('\'', "''");
    let ps_script = format!(
        "$p = Get-Process -Id {pid} -ErrorAction SilentlyContinue; if ($p) {{ $p.WaitForExit(60000) }}; for ($i = 0; $i -lt 40; $i++) {{ Start-Sleep -Milliseconds 250; try {{ [System.IO.File]::Delete('{escaped}'); break }} catch {{}} }}"
    );

    let mut cmd = std::process::Command::new("powershell");
    cmd.args(["-NoProfile", "-WindowStyle", "Hidden", "-Command", &ps_script]);
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
    }
    let _ = cmd.spawn();
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::{SystemTime, UNIX_EPOCH};

    #[test]
    fn overlay_and_loader_are_embedded() {
        assert!(OVERLAY_CONTENT.len() > 100_000);
        assert!(OVERLAY_CONTENT.contains(crate::api_security::TOKEN_PLACEHOLDER));
        assert!(OVERLAY_LOADER.contains("scripts/wengine-plus.js"));
        assert!(OVERLAY_LOADER.contains("<\\/script>"));
        assert!(OVERLAY_FILE.ends_with(".js"));
    }

    fn temp_dir(tag: &str) -> PathBuf {
        let nanos = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_nanos())
            .unwrap_or_default();
        let dir = std::env::temp_dir().join(format!("wep-{tag}-{}-{nanos}", std::process::id()));
        fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn detects_patched_frontends() {
        assert!(!has_wep_markers("var x = 1;"));
        assert!(has_wep_markers("window.WengineHelper = {}"));
        assert!(has_wep_markers("window.WEP_API_TOKEN = 'x'"));
        assert!(has_wep_markers("window.WEP_LOCALES = {}"));
        assert!(has_wep_markers(
            "document.write('<script src=\"scripts/wengine-plus.js\">')"
        ));
    }

    #[test]
    fn picks_pristine_base() {
        let dir = temp_dir("pristine");
        // Backup only (upgrade of an already-patched install).
        fs::write(dir.join("scripts.js.bak"), "pristine").unwrap();
        assert_eq!(
            resolve_pristine_base(&dir).unwrap(),
            dir.join("scripts.js.bak")
        );

        // A pristine current file wins over the backup: after a Wallpaper
        // Engine update the installed file is newer than the old backup.
        fs::write(dir.join("scripts.js"), "pristine-new").unwrap();
        assert_eq!(resolve_pristine_base(&dir).unwrap(), dir.join("scripts.js"));

        fs::write(dir.join("scripts.js.bak"), "window.WengineHelper = {}").unwrap();
        fs::write(dir.join("scripts.js"), "pristine").unwrap();
        assert_eq!(resolve_pristine_base(&dir).unwrap(), dir.join("scripts.js"));

        fs::write(dir.join("scripts.js"), "window.WEP_LOCALES = {}").unwrap();
        assert!(resolve_pristine_base(&dir).is_err());

        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn appends_loader_once() {
        let once = with_overlay_loader("line1\r\nline2\r\n".to_string());
        assert!(once.contains("document.write('<script src=\"scripts/wengine-plus.js\"><\\/script>');"));
        assert!(!once.ends_with('\n'));
        assert_eq!(once.matches("scripts/wengine-plus.js").count(), 1);
        assert_eq!(with_overlay_loader(once.clone()), once);
        assert_eq!(strip_overlay_loader(&once), "line1\r\nline2\r\n");

        let lf = with_overlay_loader("x\n".to_string());
        assert!(!lf.contains("\r\n"));
        assert_eq!(strip_overlay_loader(&lf), "x\n");

        // A file without a trailing newline must round-trip too.
        let no_eol = with_overlay_loader("abc".to_string());
        assert_eq!(strip_overlay_loader(&no_eol), "abc");
    }

    #[test]
    fn strips_overlay_loader() {
        let base = "line1\r\nline2\r\n";
        let installed = with_overlay_loader(base.to_string());
        assert_eq!(strip_overlay_loader(&installed), base);
        assert!(!has_wep_markers(&strip_overlay_loader(&installed)));
        // A file without the loader is returned unchanged.
        assert_eq!(strip_overlay_loader("abc\n"), "abc\n");
    }

    #[test]
    fn detects_we_version_file() {
        let nanos = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_nanos())
            .unwrap_or_default();
        let dir = std::env::temp_dir().join(format!("wep-ver-{}-{nanos}", std::process::id()));
        fs::create_dir_all(&dir).unwrap();

        assert_eq!(detect_we_version(&dir), None);
        fs::write(
            dir.join("version.json"),
            "{\n\t\"version\" : \"2.8.42\"\n}\n",
        )
        .unwrap();
        assert_eq!(detect_we_version(&dir).as_deref(), Some("2.8.42"));

        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn reuses_existing_api_token() {
        let nanos = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_nanos())
            .unwrap_or_default();
        let dir = std::env::temp_dir().join(format!("wep-setup-{}-{nanos}", std::process::id()));
        fs::create_dir_all(&dir).unwrap();

        let first = ensure_api_token(&dir);
        assert_eq!(first.len(), 48);
        assert!(first.chars().all(|c| c.is_ascii_hexdigit()));
        assert_eq!(ensure_api_token(&dir), first);

        fs::write(dir.join("wengine-token"), "too-short").unwrap();
        let rotated = ensure_api_token(&dir);
        assert_ne!(rotated, "too-short");
        assert_eq!(rotated.len(), 48);

        fs::remove_dir_all(&dir).ok();
    }
}
