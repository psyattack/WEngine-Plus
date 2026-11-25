//! Windows resources: the application icon, VERSIONINFO and the compatibility/DPI manifest.
//!
//! The version is derived from `Cargo.toml` by `winres` (numeric `FILEVERSION`/`PRODUCTVERSION`
//! and the strings Explorer shows), so this file must not carry a second version. The icon source
//! is `assets/app.svg`; `assets/app.png` and `assets/app.ico` are exports and only the `.ico` is
//! consumed here.

fn main() {
    // Track the inputs used here so a version bump or a replaced icon rebuilds the resources.
    println!("cargo:rerun-if-changed=Cargo.toml");
    println!("cargo:rerun-if-changed=assets/app.ico");

    #[cfg(windows)]
    {
        let mut res = winres::WindowsResource::new();
        res.set_icon("assets/app.ico");
        res.set("ProductName", "WEngine-Plus");
        res.set("FileDescription", "WEngine-Plus helper daemon and frontend patch");
        res.set("CompanyName", "psyattack");
        res.set("LegalCopyright", "psyattack");
        res.set("OriginalFilename", "wengine-helper.exe");
        res.set("InternalName", "wengine-helper");
        res.set_manifest(
            r#"
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
<compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
    <application>
        <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}"/>
    </application>
</compatibility>
<application xmlns="urn:schemas-microsoft-com:asm.v3">
    <windowsSettings>
        <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/pm</dpiAware>
        <dpiAwareness xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">PerMonitorV2</dpiAwareness>
    </windowsSettings>
</application>
</assembly>
"#,
        );
        res.compile().unwrap_or_else(|error| {
            panic!("failed to compile the Windows resources (icon, VERSIONINFO, manifest): {error}")
        });
    }
}
