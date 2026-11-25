//! Native Win32 folder picker.
//!
//! The previous implementation spawned `powershell.exe` just to show a
//! `FolderBrowserDialog`, which is slow and trips AV heuristics.

use std::path::PathBuf;

#[cfg(windows)]
pub fn pick_folder(title: &str) -> Option<PathBuf> {
    use std::ffi::OsString;
    use std::os::windows::ffi::{OsStrExt, OsStringExt};
    use windows_sys::Win32::System::Com::{
        CoInitializeEx, CoTaskMemFree, CoUninitialize, COINIT_APARTMENTTHREADED,
    };
    use windows_sys::Win32::UI::Shell::{
        SHBrowseForFolderW, SHGetPathFromIDListW, BIF_NEWDIALOGSTYLE, BIF_RETURNONLYFSDIRS,
        BROWSEINFOW,
    };

    let title_wide: Vec<u16> = std::ffi::OsStr::new(title)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect();
    let mut display_name = vec![0u16; 260];

    unsafe {
        // The shell dialog requires an initialized COM apartment; APARTMENTTHREADED
        // is what the shell expects. A failure here is not fatal for the dialog.
        let hr = CoInitializeEx(std::ptr::null(), COINIT_APARTMENTTHREADED as u32);

        let mut browse: BROWSEINFOW = std::mem::zeroed();
        browse.pszDisplayName = display_name.as_mut_ptr();
        browse.lpszTitle = title_wide.as_ptr();
        browse.ulFlags = BIF_RETURNONLYFSDIRS | BIF_NEWDIALOGSTYLE;

        let pidl = SHBrowseForFolderW(&browse);
        let result = if pidl.is_null() {
            None
        } else {
            let mut path = vec![0u16; 32_768];
            let ok = SHGetPathFromIDListW(pidl, path.as_mut_ptr()) != 0;
            CoTaskMemFree(pidl as *const std::ffi::c_void);
            if ok {
                let len = path.iter().position(|&c| c == 0).unwrap_or(path.len());
                Some(PathBuf::from(OsString::from_wide(&path[..len])))
            } else {
                None
            }
        };

        if hr >= 0 {
            CoUninitialize();
        }
        result
    }
}

#[cfg(not(windows))]
pub fn pick_folder(_title: &str) -> Option<PathBuf> {
    None
}
