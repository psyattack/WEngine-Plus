# Changelog

## [2.0.0](https://github.com/psyattack/WEngine-Plus/compare/v1.4.0...v2.0.0) - 2026-11-25

### Added
- Russian and Simplified Chinese translations for the WEngine-Plus interface, following Wallpaper Engine's language setting; English remains the fallback.
- `--uninstall` (`-u`) removes the overlay loader, restores the original frontend and deletes the helper's token, metadata, sessions, accounts, logs, plugins and portable runtime.
- A rotating `wengine-helper.log` in the scripts directory, so startup, update and download problems can be diagnosed without a console.
- An application icon and version information on `wengine-helper.exe`.

### Changed
- The frontend patch is now one loader line appended to Wallpaper Engine's pristine `scripts.js` plus the separate `wengine-plus.js` overlay. The stock frontend is no longer replaced with a modified copy, so the patch is smaller and uninstalling restores the original UI. The overlay provides the Workshop browser, filters, Steam sign-in, download accounts, downloads, extraction and the update widget.
- The local helper API now requires the per-install `X-Wengine-Client` token, rejects unexpected browser origins and confines file operations to the Wallpaper Engine folder and known workshop wallpaper folders.
- Starting the helper again now exits quietly when a healthy instance already owns the port and reports a conflict when another application owns it, instead of competing for the same state.
- The installer refuses to patch a frontend that is neither pristine nor backed up, instead of overwriting it.
- The documentation was rewritten: English, Russian and Chinese READMEs, plus an FAQ, API reference, architecture guide and contribution and security notes.
- Compatibility: developed and tested against Wallpaper Engine 2.8.42. Other versions will most likely work, but they are not guaranteed; open an issue with your `version.json` if something breaks.

### Fixed
- `metadata.json` is now written to a temporary file and renamed, so a failed or interrupted write no longer truncates the offline wallpaper database.

<details><summary>Detailed Changelog</summary>

### Added
- global update 2.0 (by @psyattack in b73eb0f)

</details>


## [1.4.0](https://github.com/psyattack/WEngine-Plus/compare/v1.3.0...v1.4.0) - 2026-10-15

### Added
- Live download progress: DepotDownloaderMod output is streamed into the task status, so the overlay shows the current line, a percentage and a per-task phase instead of a single "starting" state.
- Silent setup mode now handles a running game: it waits for `wallpaperui.exe` to close, replaces the binary and the patched frontend, starts the new helper and restarts Wallpaper Engine in one unattended run.

### Changed
- Installing and updating share one silent path, so an update no longer needs a separate patch flow.

<details><summary>Detailed Changelog</summary>

### Added
- stream DepotDownloaderMod output into download task progress (by @psyattack in 90b3b51)
- unify silent setup and update installation (by @psyattack in 90b3b51)

</details>

## [1.3.0](https://github.com/psyattack/WEngine-Plus/compare/v1.2.0...v1.3.0) - 2026-10-13

### Added
- Automatic updates: the version chip in the title bar checks GitHub Releases, downloads the new executable, validates it and can replace the helper and reinstall the frontend patch without a manual download.
- Local mock release endpoints for exercising the update flow without publishing a release.

<details><summary>Detailed Changelog</summary>

### Added
- add automatic GitHub update system and silent patcher (by @psyattack in ee349bd)

</details>

## [1.2.0](https://github.com/psyattack/WEngine-Plus/compare/v1.1.0...v1.2.0) - 2026-10-13

### Changed
- The Installed and Workshop sources keep their own filter and pagination state, so switching between them no longer resets the filters.

<details><summary>Detailed Changelog</summary>

### Changed
- isolate Installed and Workshop state (by @psyattack in c07e36c)

</details>

## [1.1.0](https://github.com/psyattack/WEngine-Plus/compare/v1.0.1...v1.1.0) - 2026-10-12

### Added
- One-click installer: it locates Wallpaper Engine automatically, backs up `scripts.js`, copies itself into the scripts directory, applies the overlay patch and starts the helper.
- Safe wallpaper deletion: the wallpaper currently applied to the desktop is protected, and read-only Steam files are cleaned before removal.

### Fixed
- Preview handles and locked files are released so a deleted wallpaper no longer leaves the UI showing a broken item.

<details><summary>Detailed Changelog</summary>

### Added
- implement automated one-click installer and self-relocation (by @psyattack in 134b56f)

### Fixed
- protect active wallpapers and handle preview file locks (by @psyattack in fc16972)

</details>

## [1.0.1](https://github.com/psyattack/WEngine-Plus/compare/v1.0.0...v1.0.1) - 2026-10-12

### Fixed
- A syntax error in the patched `scripts.js` prevented the Wallpaper Engine UI from loading.

<details><summary>Detailed Changelog</summary>

### Fixed
- scripts.js syntax fix (by @psyattack in 8db7a84)

</details>

## [1.0.0](https://github.com/psyattack/WEngine-Plus/releases/tag/v1.0.0) - 2026-10-12

### Added
- Initial release: a Steam Workshop browser inside Wallpaper Engine, powered by the local helper daemon, with multi-threaded downloads, RePKG extraction, Steam sign-in, download accounts, three-state filters, offline metadata and the one-line frontend patch.

<details><summary>Detailed Changelog</summary>

### Added
- initial commit (by @psyattack in 5364cf6)

</details>
