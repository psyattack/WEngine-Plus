# Contributing to WEngine-Plus

Thanks for taking the time to improve WEngine-Plus. This document covers the build, the module map,
the conventions and the documentation rules that keep the project consistent.

## Before you start

- **Platform:** Windows 10 or 11, x64. The daemon is a Windows GUI-subsystem binary and has no
  non-Windows fallback.
- **Toolchain:** a recent stable Rust toolchain. The project does not pin an MSRV and follows the
  stable channel; an older toolchain may fail on the current dependency set. Only the daemon is
  Rust — the overlay is plain JavaScript with no build step.
- **Windows SDK:** `build.rs` embeds the icon and version resources with `winres`, which calls the
  resource compiler `rc.exe`. It ships with the MSVC build tools and `winres` locates it even when it
  is not on `PATH`; a toolchain without the Windows SDK fails the build.
- **Wallpaper Engine** is needed for manual testing of the overlay, but not for building or running
  the Rust tests.
- **Node.js** is needed only for `node --check frontend/wengine-plus.js`, the JavaScript syntax gate.

## Build and test

```powershell
git clone https://github.com/psyattack/WEngine-Plus.git
cd WEngine-Plus

cargo check --all-targets
cargo test --all-targets
cargo clippy --all-targets -- -D warnings
node --check frontend/wengine-plus.js

cargo build --release            # target\release\wengine-helper.exe
```

`cargo clippy --all-targets -- -D warnings` is the CI gate: warnings are errors. Unit tests live next
to the code in `#[cfg(test)] mod tests`; there is no `tests/` directory. Run one module with
`cargo test <substring>`.

Run modes:

```powershell
cargo run -- --daemon        # local API on 127.0.0.1:43196
cargo run -- --silent        # unattended install, restarts Wallpaper Engine
cargo run -- --uninstall     # restores scripts.js.bak and removes helper state
cargo run                    # interactive setup
```

### Manual testing

The installer modifies a real Wallpaper Engine installation. Test against a copy of the scripts
directory whenever possible:

1. Copy `<Wallpaper Engine>\ui\dist\scripts` to a temporary folder that also contains a pristine
   `scripts.js`.
2. Put the built `wengine-helper.exe` next to that copy and run it from there; the installer detects
   `scripts.js` in the executable's directory and patches the copy.
3. `--uninstall` on the copy restores it and removes the helper files.

Do not run `--silent` while the UI has unsaved work: it waits for `wallpaperui.exe`, terminates it
after five seconds and restarts Wallpaper Engine. Never run `--uninstall` against someone else's
installation.

The daemon binds a fixed port. A second healthy instance exits; a foreign process on 43196 makes the
daemon exit with status 1 (`Get-NetTCPConnection -LocalPort 43196`).

## Where changes belong

| Area | Files |
|---|---|
| Process entry, mode dispatch, routes, handlers, application state | `src/main.rs` |
| Origin/token guards, CORS, path containment, pubfile-id sanitizing | `src/api_security.rs` |
| Installer, uninstaller, Wallpaper Engine discovery, frontend patching, token | `src/setup.rs` |
| Logging | `src/logging.rs` |
| Shared outbound HTTP client | `src/http.rs` |
| Native folder picker | `src/dialog.rs` |
| Steam authentication facade | `src/auth.rs` (`auth/auth.rs`, `auth/accounts.rs`) |
| QR, cookie and credentials login, session storage | `src/auth/auth.rs` |
| Download accounts, built-in account bundle, QR download login | `src/auth/accounts.rs` |
| Windows resources: icon, version info, manifest | `build.rs`, `assets/app.ico` |
| Icon source and raster exports | `assets/app.svg`, `assets/app.png`, `assets/app.ico` |
| Service facade | `src/services.rs` |
| Download tasks (DepotDownloaderMod) | `src/services/download.rs` |
| Package extraction (RePKG) | `src/services/extract.rs` |
| Plugin download/install | `src/services/plugins.rs` |
| .NET runtime detection and portable install | `src/services/dotnet.rs` |
| Metadata storage | `src/services/metadata.rs` |
| Daemon lifetime, heartbeat, UI watcher | `src/services/lifecycle.rs` |
| GitHub release check, download and self-replacement | `src/services/update.rs` |
| Steam facade | `src/steam.rs` |
| Steam HTTP client | `src/steam/client.rs` |
| Workshop HTML/SSR parser | `src/steam/parser.rs` |
| Workshop data models | `src/steam/types.rs` |
| Workshop URL and filter construction | `src/steam/url_builder.rs` |
| Runtime overlay: bridge, i18n, queue-patch, templates | `frontend/wengine-plus.js` |
| Icon | `assets/app.svg` (source) and `assets/app.png` (export) |
| Documentation | `docs/`, READMEs, `CONTRIBUTING.md`, `SECURITY.md`, `NOTICES.md` |
| CI and release automation | `.github/workflows/` |

Adding a route touches `src/main.rs` (route and handler) and the overlay bridge
(`frontend/wengine-plus.js`), and adds a row to `docs/API.md`. Adding a plugin or changing an endpoint
constant touches the relevant service and `NOTICES.md` if a dependency changes.

## Code conventions

- **Windows only.** Use `windows-sys`; do not add a portability layer or a non-Windows fallback.
- **No panics on user input.** Malformed ids, paths and JSON return `{ "ok": false, "error": … }` or a
  `4xx`/`5xx` response. `unwrap`/`expect` is acceptable only for constants and invariants that cannot
  fail (regex compilation, static selectors).
- **No secrets in logs or errors.** Log identifiers and outcomes; never log tokens, cookies,
  passwords, HTML bodies or file contents.
- **Atomic writes for user data.** Metadata uses `metadata.json.tmp.<pid>` + `sync_all` + rename;
  frontend files are written with retries for transient locks.
- **Locking.** `parking_lot` for short synchronous critical sections, `tokio::sync` for async child
  handles. Do not hold a lock across an `.await` that can take seconds.
- **Error style.** Recoverable failures are returned to the caller as a message, not `anyhow`-logged
  only. Handlers never abort the daemon.
- **Windows-specific process work.** Child processes are spawned with `CREATE_NO_WINDOW`; keep it.
- **LF line endings** are enforced by `.gitattributes`; keep them.

### Windows resources and the icon

`build.rs` embeds the icon, `VERSIONINFO` and the compatibility/DPI manifest through `winres`. The
version is never written there: `winres` derives it from `Cargo.toml`, so a release only bumps the
manifest version, the `Cargo.lock` entry and the overlay fallback (see
[docs/RELEASING.md](docs/RELEASING.md#version-source)).

The icon is authored as `assets/app.svg` (flat, two-colour, no gradients). `assets/app.png` is the
1024 px export and `assets/app.ico` is the 16–256 px export consumed by `build.rs`; all three are
committed. When changing the mark, regenerate the PNG and the ICO together and rebuild to confirm the
executable picks them up:

```powershell
cargo build
(Get-Item target\debug\wengine-helper.exe).VersionInfo | Format-List FileVersion, ProductVersion
```

The overlay has no bundler: `frontend/wengine-plus.js` is shipped as-is and embedded with
`include_str!`.

## Frontend overlay conventions

The overlay is a single classic script loaded before AngularJS bootstraps. The full contract is in
[ARCHITECTURE.md](docs/ARCHITECTURE.md#frontend-overlay); the rules that matter for a change:

- Keep `scripts.js` pristine: the installer appends one loader line and nothing else. Never add a
  second loader or move the loader away from the end.
- New AngularJS registrations go in stage 1. Existing registrations are replaced by rewriting
  `app._invokeQueue` (stage 2/3) — never register a second directive/controller/service with an
  existing name.
- The replacement payload repeats the registration name: `["titlebar", [ ...DI..., fn ]]`.
- Blocks copied from the upstream UI stay verbatim; a WEP change is a small delta inside the block,
  not a reformat.
- Templates are overridden in the final `run` block with `$templateCache.put`; the last put wins.
- User-visible strings are `ui_wep_*` keys in `WEP_LOCALES` for `en-us`, `ru-ru` and `zh-chs`, with
  identical keys, order and `{{placeholders}}`. Do not add literals to views or controllers.
- The bridge (`window.WengineHelper`) is the only daemon client; keep the token header wrapper intact.
- The fallback version in the titlebar must match `Cargo.toml` on a release.
- Run `node --check frontend/wengine-plus.js` after every edit; there is no bundler and no other
  static check.

## Tests

Add a unit test next to the code you change, covering behavior rather than implementation details.
Useful existing patterns:

- `src/setup.rs`: round-trip tests for the loader, pristine-base selection and token reuse, using
  per-test temporary directories.
- `src/api_security.rs`: origin parsing, middleware behavior with `tower::ServiceExt::oneshot`, path
  containment and token extraction.
- `src/steam/url_builder.rs`: URL construction and sort mapping.
- `src/steam/parser.rs`: pagination parsing from saved HTML fragments.
- `src/services/update.rs`: version comparison.

Tests must not touch the real Wallpaper Engine directory, the real API port or real user files. The
database of tests is self-contained; a network connection is never required.

For overlay changes, run `node --check`, then verify the flow manually in Wallpaper Engine or in a
sandbox copy as described above.

## Documentation and localization

Documentation has one owner per topic. The document set and its owners are listed once, in
[docs/README.md](docs/README.md); update the owning file and link to it instead of copying its
content elsewhere.

- Behavior, setup/patching, storage, subsystems → `docs/ARCHITECTURE.md`.
- HTTP routes, request/response shapes and models → `docs/API.md`.
- User-facing questions and troubleshooting → `docs/FAQ.md`.
- Release mechanics → `docs/RELEASING.md`.
- User overview, flags and data files → `README.md`, `README.ru.md`, `README.zh.md` (all three are
  mirrors; keep them in sync).
- Dependencies and license texts → `NOTICES.md`.

User-visible overlay strings live in `WEP_LOCALES`. When adding a key, add it to all three tables in
the same position and run the placeholder check described in the pull-request checklist. Wallpaper
Engine's own `ui_*` keys must not be redefined.

## Commits and pull requests

Use Conventional Commits with a short scope, matching the existing history:

```
feat(filters): isolate Installed and Workshop state
feat(update): add automatic GitHub update system and silent patcher
fix(wallpaper-deletion): protect active wallpapers and handle preview file locks
docs(readme): add the Simplified Chinese README
chore(release): bump version to 1.5.0
```

Keep a pull request focused on one concern. Fill in `.github/PULL_REQUEST_TEMPLATE.md`, list the
commands you ran, and describe manual steps for overlay changes. Maintainers cut the release and turn
the pull-request description into the `CHANGELOG.md` entry, as described in
[docs/RELEASING.md](docs/RELEASING.md).

By submitting a contribution you agree that it is licensed under the [MIT License](LICENSE).

## Reporting bugs and security issues

- Reproducible bugs and feature requests:
  [GitHub Issues](https://github.com/psyattack/WEngine-Plus/issues/new/choose).
- Questions and troubleshooting: [docs/FAQ.md](docs/FAQ.md).
- Vulnerabilities: follow [SECURITY.md](SECURITY.md) and report privately; do not open a public
  issue.
- Community behavior: see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
