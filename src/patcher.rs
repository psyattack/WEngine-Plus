use std::fs;
use std::io::{self, BufRead};
use std::path::PathBuf;

const PATCHED_SCRIPTS: &str = include_str!("../scripts.js");

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

        let title: Vec<u16> = "WEngine Helper - Patcher\0".encode_utf16().collect();
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

pub fn run_patch_mode(auto_confirm: bool) {
    let is_new_window = setup_console();
    let should_wait = is_new_window || (!auto_confirm);

    println!();
    println!("==============================================================");
    println!("               WEngine Helper - Script Patcher                ");
    println!("==============================================================");
    println!();

    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));

    let current_dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));

    // Check potential locations for scripts.js:
    // 1. Same directory as the executable
    // 2. Current working directory
    let exe_scripts = exe_dir.join("scripts.js");
    let cur_scripts = current_dir.join("scripts.js");

    let scripts_path = if exe_scripts.exists() {
        exe_scripts
    } else if cur_scripts.exists() && exe_dir.ends_with("release") || exe_dir.ends_with("debug") {
        cur_scripts
    } else {
        println!("[-] ERROR: scripts.js not found in current directory!");
        println!();
        println!("    Expected next to executable:");
        println!("      {}", exe_scripts.display());
        println!();
        println!("    Please place wengine-helper.exe into the Wallpaper Engine directory:");
        println!(r"    C:\Program Files\Wallpaper Engine\ui\dist\scripts\");
        wait_for_enter(should_wait);
        std::process::exit(1);
    };

    println!("[*] Found target: {}", scripts_path.display());

    let existing_content = match fs::read_to_string(&scripts_path) {
        Ok(c) => c,
        Err(e) => {
            println!("[-] ERROR: Failed to read scripts.js: {}", e);
            wait_for_enter(should_wait);
            std::process::exit(1);
        }
    };

    let already_patched = existing_content.contains("WengineHelper");
    if already_patched {
        println!("[*] scripts.js is already patched with WEngine Helper.");
        println!("[*] Updating to the latest version...");
    }

    // Create backup if not already present
    let backup_path = scripts_path.with_file_name("scripts.js.bak");
    if !backup_path.exists() {
        print!("[*] Creating backup: {} ... ", backup_path.file_name().unwrap_or_default().to_string_lossy());
        match fs::write(&backup_path, existing_content.as_bytes()) {
            Ok(_) => println!("OK"),
            Err(e) => {
                println!("FAILED ({})", e);
                println!("[-] Warning: Could not create backup. Aborting patch for safety.");
                wait_for_enter(should_wait);
                std::process::exit(1);
            }
        }
    } else {
        println!("[*] Existing backup found: {}", backup_path.display());
    }

    // Write patched scripts.js
    print!("[*] Applying WEngine Helper modifications... ");
    match fs::write(&scripts_path, PATCHED_SCRIPTS.as_bytes()) {
        Ok(_) => println!("OK"),
        Err(e) => {
            println!("FAILED ({})", e);
            println!("[-] ERROR: Failed to write patched scripts.js.");
            wait_for_enter(should_wait);
            std::process::exit(1);
        }
    }

    println!();
    println!("[SUCCESS] Patch applied successfully! You can now start Wallpaper Engine GUI.");

    wait_for_enter(should_wait);
    std::process::exit(0);
}
