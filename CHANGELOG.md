# Changelog

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
