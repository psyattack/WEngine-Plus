# WEngine-Plus Architecture

WEngine-Plus is a Windows-only (x64) project with two halves that ship together but run in different
processes:

```
+----------------- Wallpaper Engine UI (CEF, http://wpx.internal) -----------------+
|  ui/dist/index.html                                                                       |
|    scripts/scripts.js        pristine Wallpaper Engine frontend + one loader line         |
|    scripts/wengine-plus.js   WEngine-Plus runtime overlay (classic script)                 |
|      prelude  - token, fetch wrapper, i18n tables, the WengineHelper bridge                |
|      stage 1  - new AngularJS registrations                                               |
|      stage 2  - queue-patched registrations + queue rewrite                                |
|      stage 3  - queue-patched registrations + queue rewrite                                |
|      run      - $templateCache.put for ten templates                                       |
+--------------------------------------+-----------------------------------------------------+
                                       | HTTP, 127.0.0.1:43196
                                       | X-Wengine-Client: <per-install token>
+--------------------------------------v-----------------------------------------------------+
|  wengine-helper.exe (daemon)                                                               |
|    axum router + guards | Steam auth | accounts | workshop scraper | downloads | unpacker  |
|    plugin and .NET runtime manager | metadata store | updater | lifecycle | caches          |
+--------------------------------------------------------------------------------------------+
```

There is no cloud component and no telemetry. The daemon talks to Steam and GitHub, downloads two
third-party tools and a portable .NET runtime on demand, and otherwise stays local.

The repository layout (top level only) is in the Project structure section of
[README.md](../README.md); module-level pointers are in [CONTRIBUTING.md](../CONTRIBUTING.md)
("Where changes belong"). This document explains how the pieces behave and why.

Related documents: [documentation map](README.md) · [HTTP API](API.md) ·
[FAQ and troubleshooting](FAQ.md) · [contributing](../CONTRIBUTING.md).

## Process model and runtime modes

One executable, `wengine-helper.exe`, dispatches in a fixed order before any subsystem starts:

| Invocation | Behavior |
|---|---|
| `--uninstall` / `-u` / `/uninstall` | Restore the frontend, remove helper files, delete the executable after exit |
| `--silent` / `-s` | Unattended setup: patch, install, restart Wallpaper Engine, exit |
| `--daemon` / `-d` / `/daemon` | Run the local HTTP service |
| parent process name contains `wallpaper` | Run the local HTTP service (this is how the UI starts it) |
| no flag | Interactive setup with a console UI |

The parent-process probe is what lets the patched frontend start the helper without arguments. A
developer launch from `target/release` or `target/debug` therefore starts the daemon when launched by
Wallpaper Engine, but starts the installer when launched from a terminal.

**Single instance is enforced by the listening port.** The daemon binds `127.0.0.1:43196` before it
creates managers or touches persistent state. If the bind fails, it probes `GET /api/ping`: a healthy
existing helper makes the new process exit quietly with status 0; any other owner of the port is
logged and the process exits with status 1. This ordering is deliberate — a second instance must not
rewrite `metadata.json`, clean up files or race the first one.

**Daemon lifetime.** `LifecycleManager::new` starts two watchers:

- a thread that waits for `wallpaperui.exe` to appear (up to 10 seconds), opens it with
  `PROCESS_SYNCHRONIZE` and exits the daemon when it closes. During an update the exit is suppressed
  so the updater can finish replacing the binary.
- a heartbeat watchdog: the first `POST /api/heartbeat` enables it, and if no heartbeat arrives for
  15 seconds the daemon logs the gap and exits. The overlay sends a heartbeat every 5 seconds.

The executable is a Windows GUI-subsystem binary, so stdout and stderr are invisible in production;
all diagnostics go to `wengine-helper.log`.

## Setup: locating Wallpaper Engine

`setup::find_wallpaper_engine_scripts` resolves the directory that contains `scripts.js` in this
order:

1. A running `wallpaper64.exe` / `wallpaper32.exe`, mapping the executable's parent through
   `ui\dist\scripts`, `dist\scripts`, `scripts` or the folder itself.
2. The registry: `Uninstall\Steam App 431960` (`InstallLocation`) for the machine and the user, then
   `SteamPath` / `InstallPath`, then `steamapps\common\wallpaper_engine` and every `path` entry in
   `libraryfolders.vdf`.
3. Common locations on every drive (`SteamLibrary`, `Steam`, `Games`, `Wallpaper Engine`, Program
   Files variants).
4. A PowerShell folder picker.
5. A console prompt for a manual path.

`find_wallpaper_engine_dir` uses the same process/registry/path order to find the installation root,
which is needed for `projects\` and `workshop\` content.

The detected `version.json` is compared with `BUILT_FOR_WE_VERSION` (`2.8.42`). A different version
only prints a warning in interactive setup: the patched registrations are copies of a specific UI
build, and a future UI build may have moved its code.

## Setup: patching the frontend

The installer never ships a patched `scripts.js`. It takes the pristine frontend and appends one
line:

```js
document.write('<script src="scripts/wengine-plus.js"><\/script>');
```

Steps in `run_setup_mode`:

1. Resolve the target scripts directory (the executable's directory if it already contains
   `scripts.js`, the working directory when the binary runs from `target\release`/`target\debug`,
   otherwise the discovery above).
2. In silent mode wait up to 5 seconds for `wallpaperui.exe`, then terminate any remaining UI
   process — Windows keeps the JavaScript file locked while the UI is open. Terminate other helper
   instances too.
3. Copy the executable into the target directory. A permission error triggers a UAC prompt through
   PowerShell `Start-Process -Verb RunAs`; the original downloaded binary is deleted after its
   process exits.
4. Create `scripts.js.bak` once, if it does not exist.
5. Reuse or generate the API token in `wengine-token` (48 lowercase hex characters). A token written
   by an earlier install is reused so an update does not invalidate the running UI.
6. Choose the pristine base: the installed `scripts.js` if it contains no WEngine-Plus markers,
   otherwise `scripts.js.bak`. If neither is pristine the install aborts with instructions to verify
   the game files.
7. Append the loader exactly once, keeping the base's line-ending style and writing the loader as the
   last line without a trailing newline. This makes uninstall a byte-exact reversal. Substitute
   `__WEP_TOKEN__` in both the base and the overlay, then write `scripts.js` and `wengine-plus.js`
   with retries for transient locks.
8. Clean up `wengine-helper.exe.update` / `.update.zip` / `.old`, start `wengine-helper.exe --daemon`
   from the target directory, and in silent mode restart Wallpaper Engine.

Markers that identify an already patched frontend: `WengineHelper`, `WEP_API_TOKEN`, `WEP_LOCALES`
and `wengine-plus.js`. They are the reason a UI update (which replaces `scripts.js` with a pristine
file) cannot break the uninstall path.

### Uninstall

`run_uninstall` stops helper processes, then restores the frontend by stripping the loader from the
current `scripts.js` when the result has no WEP markers; otherwise it copies `scripts.js.bak` back.
After a successful restore the backup is removed. It then deletes the files WEngine-Plus owns —
`wengine-helper.exe.old`, `.update`, `.update.zip`, `wengine-plus.js`, `wengine-token`, the log file,
`metadata.json`, `steam_session.json`, `download_accounts.json` — and the `plugins/` and `dotnet/`
trees. The running executable cannot delete itself on Windows, so a detached PowerShell process waits
for the process id and removes it.

The loader string, the token placeholder and the WEP markers live in one place, `src/setup.rs`
(with the token placeholder and the marker lookup in `src/api_security.rs`). The overlay embeds no
loader of its own.

## Daemon startup

After dispatch, `main`:

1. Resolves the scripts directory: the executable's directory when it contains `scripts.js` or ends
   with `scripts`, otherwise `<Wallpaper Engine>\ui\dist\scripts`, otherwise the conventional
   `C:\Program Files\Wallpaper Engine\ui\dist\scripts`, otherwise the executable's directory.
2. Initializes the log in that directory and logs the version and resolved paths.
3. Builds the shared `reqwest` client (15 s connect timeout, `WEngine-Plus/<version>` user agent) and
   loads the API token.
4. Binds the listener (see single instance above), removes a stale `.old` executable, creates
   `plugins/`.
5. Creates the managers: `AuthManager`, `SteamClient`, `LifecycleManager`, `AccountsManager`,
   `DownloadManager`, `ExtractManager`, `DotnetManager`, `PluginManager`,
   `QrDownloadAuthManager`, `MetadataManager` (which prunes metadata for wallpapers no longer on
   disk), `UpdateManager`, and two in-memory caches.
6. Starts a background login with the built-in system account when no session exists.
7. Builds the axum router with the request guard, the token extension and the CORS layer, then
   serves.
8. One and a half seconds after start it runs an automatic update check unless `WENGINE_MOCK_UPDATE`
   selects the local mock release.

Managers are `Arc`-shared and carry their own locking (`parking_lot` for short critical sections,
`tokio::sync` for async handles). Handlers take `State<AppState>`; nothing is global.

## Storage and persistence

All operational files live next to the patched UI, in the Wallpaper Engine scripts directory. The
complete user-facing table is in the README "Configuration & data storage" section; this section
covers the write behavior.

| File | Owner | Write behavior |
|---|---|---|
| `scripts.js` | installer/uninstaller | Rewritten from a pristine base plus the loader; retries for locks |
| `scripts.js.bak` | installer | Created once, restored on uninstall |
| `wengine-plus.js` | installer | Written with the injected token |
| `wengine-token` | installer/daemon | 48 hex characters, reused until invalid |
| `metadata.json` | `MetadataManager` | Pretty JSON through `metadata.json.tmp.<pid>`, `sync_all`, rename |
| `steam_session.json` | `AuthManager` | Pretty JSON, rewritten on login/QR success, removed on logout |
| `download_accounts.json` | `AccountsManager` | Pretty JSON; passwords are `skip_serializing` |
| `wengine-helper.log` | `logging` | Single file, capped at 8 MiB; the older half is dropped at the limit |

There is no `%LOCALAPPDATA%` state and no registry state beyond reading Wallpaper Engine's install
location. The daemon is the only writer while it runs; the UI never edits these files directly.

## Local HTTP API and security

The API is documented endpoint by endpoint in [API.md](API.md). The security model:

- **Loopback only.** The listener is `127.0.0.1:43196`; the address is not configurable.
- **Per-install token.** The installer injects a random token into the overlay, which sends it as
  `X-Wengine-Client` on every helper request. The daemon reads the token from the installed
  `scripts.js`, then `wengine-plus.js`, then `wengine-token`, and falls back to the development
  placeholder. Comparison is length-checked and constant-time.
- **Origin guard.** When a browser sends an `Origin` header, only `null`, `http://wpx.internal`
  (the Wallpaper Engine CEF UI), `file://` and loopback origins are accepted. This stops a web page
  from driving the API with "simple" requests, which CORS alone does not block.
- **CORS.** Only trusted origins get read access, only `GET`/`POST`, only `content-type` and
  `x-wengine-client` headers. Preflights are answered by the CORS layer outside the token guard.
- **The only unauthenticated route is `GET /api/ping`**, used by the single-instance probe and by
  whoever starts the daemon.
- **Path containment.** Caller-supplied paths are canonicalized and must be inside the Wallpaper
  Engine directory or a known workshop root; a wallpaper delete target must be a direct child of one
  of the container folders. Pubfile ids are trimmed to at most 20 decimal digits before they reach
  the file system.
- **No secret in an error.** Errors returned to the UI name the failure, not the token or cookie.

## Steam workshop pipeline

`SteamClient` performs plain HTML requests with browser-like headers, an English language priority
and the age-gate cookies. `AuthManager::get_cookie_header` adds `steamLoginSecure` and `sessionid`
when a session exists.

`url_builder::build_browse_url`:

- `preset` turns a request into `sharedfiles/filedetails/?id=<id>` (used for collections).
- `itemid` turns a request into an author page (`/profiles/<id>/myworkshopfiles/`, `/id/<name>/...`,
  or a full URL), with `numperpage=30`; otherwise the workshop browser is used with
  `appid=431960`, `section=readytouseitems`, `num_per_page=50`.
- Wallpaper Engine sort values are mapped to Steam's `browsesort`/`days`/`browsefilter` vocabulary;
  an unknown value is passed through, an empty value becomes `textsearch` when a query exists and
  `trend/7` otherwise.
- Text in quotes becomes an exact search (`search_text_mode=1`); tags and flags are repeated
  `requiredtags[]` / `excludedtags[]` / `requiredflags[]` parameters.

`parser::parse_browse` is layered:

1. Steam's SSR `queries` JSON (complete items with tags and author data).
2. HTML tiles (`parse_browse_html`).
3. A loose regular-expression fallback when the markup changed.
4. Metadata merge from the HTML tiles into SSR items (author, avatar, preview, tags).
5. Item normalization: type from tags, rating rounding to stars, `file` as
   `workshop/<id>`, readable placeholders for empty titles, collection detection when there is no
   preview.
6. Pagination: SSR data, then "Showing X–Y of Z", then paging controls, then `pagelink` /
   `page_current` cells; a full page without pagination data is treated as "many pages".

Details requests use `parser::parse_item_details` with selector fallbacks (title, description,
preview image, author block, rating). Results are merged with the in-memory workshop cache for
missing fields (cleared once it grows past 1000 items) and persisted to `metadata.json` only when
the wallpaper is installed on disk.

Browse results are cached for 300 seconds; when the map exceeds 60 pages, entries older than the TTL
are dropped and the next page is prefetched in the background. The cache key is the normalized
query; the token is rewritten into the cached page so the client's pagination token stays
consistent. A failed Steam
request is answered with a 500 and an empty page carrying `isbackup: true` and an `error` field,
which the overlay renders as a fallback state.

## Authentication and accounts

Four login routes exist, all surfaced in the overlay's Steam dialog:

- **QR code** (`/api/auth/qr/begin`, `/api/auth/qr/poll`): starts Steam's `BeginAuthSessionViaQR`
  with the device name `WallpaperEngine`, renders the challenge URL as an SVG QR code, and polls
  `PollAuthSessionStatus`. A successful poll decodes the JWT payload to read the SteamID, builds a
  `steamLoginSecure` cookie, fetches the persona name and avatar from the community XML profile and
  stores the session.
- **Cookie** (`/api/auth/cookie`): accepts an existing `steamLoginSecure` value (optionally with a
  SteamID); a random `sessionid` is generated.
- **Credentials** (`/api/auth/login`): fetches Steam's RSA public key, encrypts the password with
  PKCS#1 v1.5 and starts a credentials session; the same poll path completes it.
- **System account** (`/api/steam/login/system`): decrypts the built-in account bundle
  (AES-256-GCM, key derived from a fixed constant) and logs in with the bundled credentials.

`AuthStatus` is polled by the UI; a QR or explicit login broadcasts `steamAuthChanged` inside the
overlay.

Download accounts are separate from the web session: `download_accounts.json` stores an always
present, non-removable `Auto` entry plus custom entries. A custom entry with a password is used
first; otherwise the built-in pool is returned; the last fallback is `anonymous`. Passwords are never
serialized back to disk by `AccountItem` (`skip_serializing`) and are never logged.

The QR download-account flow (`/api/accounts/qr/start`, `/status`, `/cancel`) runs
`DepotDownloaderMod -app 730 -depot 0 -remember-password -qr`, reads the process output line by line,
captures the block-drawing QR between "with this QR code:" markers, and adds the account when the
tool prints a successful license line for `-username <name>`. It is a separate manager because that
process must be killed when the modal closes.

## Downloads and extraction

`DownloadManager::start` validates the pubfile id, refuses a duplicate start for an active task and
spawns one task per wallpaper. The task tries each credential in order:

```
DepotDownloaderMod.exe -app 431960 -pubfile <id> -verify-all
    -username <user> [-password <pass>] -remember-password
    -loginid <random> -max-downloads 32 -dir <WE>\projects\myprojects\<id>
```

Output is streamed with a 20-second connection window before the next credential is tried; progress
comes from `NN%` matches and is reported as `TaskStatus` with a phase (`starting`, `running`,
`completed`, `failed`, `cancelled`). Success is a zero exit code or any file in the target directory.
Cancelling kills the child and removes the partial folder only when that call cancelled an active
task, so cancelling a finished wallpaper cannot delete installed content. The overlay polls
`/api/workshop/download/all` and marks a wallpaper installed when its task completes.

`ExtractManager::start` locates a `.pkg` next to a caller-supplied file/directory or in the known
wallpaper directories for a pubfile id, then runs:

```
RePKG.exe extract -c -n -o <output> <package.pkg>
```

The output defaults to the wallpaper folder; a caller-chosen folder becomes
`<output>\<pubfileid>`. Files appearing in the output directory count as success even if RePKG exits
non-zero, because RePKG reports warnings on partially recoverable packages.

## Plugins and the .NET runtime

Two plugin definitions are constants in `src/services/plugins.rs`:

| Plugin | Archive | Binary | Notes |
|---|---|---|---|
| DepotDownloaderMod 3.4.0.2 | RAR | `DepotDownloaderMod.exe` | strips the `Release/net9.0/` prefix |
| RePKG v0.4.0-alpha | ZIP | `RePKG.exe` | — |

`PluginManager` reports readiness per plugin and for .NET, and `start_ensure` runs one guarded
background job: ensure .NET, then download and extract each missing plugin (progress 0–80 % download,
85 % extract, 100 % ready). A plugin counts as installed only when its binary exists either in
`plugins/<id>/` or directly in `plugins/`.

`DotnetManager` considers .NET ready when `dotnet --list-runtimes` reports a
`Microsoft.NETCore.App` runtime with major version 8 or newer (9 and later are backwards compatible
with DepotDownloaderMod and RePKG), or when the portable runtime in `dotnet/dotnet.exe` exists. When
only the portable runtime is available, child processes get `DOTNET_ROOT` and a prefixed `PATH`.
Otherwise it downloads `dotnet-runtime-9.0.17-win-x64.zip` from Microsoft's build feed, extracts it
and reports progress.

## Updates

`UpdateManager` polls `https://api.github.com/repos/psyattack/WEngine-Plus/releases/latest` (or
`WENGINE_UPDATE_URL`). The check is cached for 300 seconds unless forced. A release is relevant when
its `tag_name` is numerically newer than `CARGO_PKG_VERSION` and it publishes exactly one `.zip`
asset with a size and a `sha256:<hex>` digest in the GitHub API response.

Downloading writes the archive to `wengine-helper.exe.update.zip` next to the running executable and
reports progress. The archive is accepted only when the downloaded byte count matches the API `size`
and the computed SHA-256 matches the API digest; a newer release without a digest is reported as a
check error instead of an available update. The updater then reads the single `wengine-helper.exe`
entry from the archive (the size limit applies to the bytes actually copied, and reading the entry to
EOF verifies the zip CRC) into `wengine-helper.exe.update`, deletes the archive and requires at least
1 MiB and an `MZ` header on the extracted file. Applying the update:

1. Marks `IS_UPDATING` so the `wallpaperui.exe` watcher does not exit the daemon.
2. Renames the running executable to `wengine-helper.exe.old`, moves the update into place and
   starts it with `--silent`, then exits. The silent setup patches the frontend, starts the new
   daemon and restarts Wallpaper Engine.
3. If the rename fails (a common Windows lock), a detached PowerShell script waits for the process to
   exit and performs the same replacement.

A stale `.old` file and a leftover `.update.zip` are deleted on the next daemon start.
`WENGINE_MOCK_UPDATE=1` and the `/api/update/mock/release` + `/api/update/mock/binary` routes serve a
zip archive with the running executable and its digest as a fake release, so the whole flow can be
exercised without publishing anything.

There is no code signing or publisher verification: the installer is a self-patching portable
executable, and the update archive is authenticated by the SHA-256 digest GitHub publishes for the
release asset. Users who need an independent check can compare the archive with `SHA256SUMS.txt`
manually.

## Frontend overlay

### Load contract

Wallpaper Engine loads `scripts/scripts.js` as a parser-blocking script in `<head>`. The appended
`document.write` therefore inserts `scripts/wengine-plus.js` right after it and the parser waits for
it; AngularJS bootstraps later on `DOMContentLoaded`. The overlay runs during parsing, before the
module config/run phase, and stays a classic script (no modules, no `async`, no `defer`).

Requirements that must not break:

- `scripts.js` remains the pristine upstream file plus exactly one loader line at the very end.
- The overlay is executed exactly once (the installer never adds a second loader).
- Nothing in the overlay depends on `DOMContentLoaded` having fired.
- Line endings are irrelevant at runtime; `.gitattributes` keeps the repository on LF.

### File shape

1. **Prelude** — one comma-expression: the resolution-tag whitelist used by `browse`, the
   `WEP_API_TOKEN` placeholder, a `fetch` wrapper that adds `X-Wengine-Client` for the helper
   origin, `WEP_LOCALES`, the `WengineHelper` bridge, and a delayed `ensureRunning()` call.
2. **Stage 1** — two new controllers: `SteamLoginModalCtrl` and `AddAccountModalCtrl`. They are
   registered directly with `angular.module("wallpaperbrowserApp").controller(...)`.
3. **Stage 2 IIFE** — WEP versions of `titlebar`, `localeLoader`, `wallpaperThumbnail`, `modals` and
   `BrowseWallpapersCtrl`. They are not registered again; the IIFE rewrites the already queued
   registrations.
4. **Stage 3 IIFE** — the same mechanism for `utils`, `host` and `EditorEffectListModalCtrl`, plus
   the `window.effectListModalGalleryMode` global the controller reads.
5. **Run block** — one `run(["$templateCache", ...])` that puts ten templates. Run blocks execute in
   registration order, and the overlay's block is registered last, so its `put` wins over the base's
   templates (`$templateCache` is a plain map).

### Queue-patch contract

AngularJS 1.6.10 queues each registration as `[provider, method, arguments]` and bootstrap calls
`provider[method].apply(provider, arguments)`. Registering a directive twice would create two
directives with the same name, and `$compileProvider` applies all of them. The overlay therefore
replaces the queued payload in place:

```js
var queue = app._invokeQueue;
for (var i = 0; i < queue.length; i++) {
  var entry = queue[i];
  var key = entry[0] + ":" + entry[1] + ":" + entry[2][0];
  if (patched.hasOwnProperty(key)) entry[2] = patched[key];
}
```

The key is `provider:method:registrationName`. The replacement payload is the **entire** arguments
array, so it must repeat the name: `["titlebar", [ ...DI..., fn ]]`. Order and count of queue entries
are unchanged; the only additions are the stage-1 controllers and the run block.

Patched registrations and why they exist:

| Registration | WEP delta |
|---|---|
| `titlebar` | strips " - Steam Edition" from the caption, exposes `appUpdate`/`initUpdateCheck`/`startAppUpdate` to the version widget |
| `localeLoader` | merges `WEP_LOCALES` between the engine dictionary and the English fallback |
| `wallpaperThumbnail` | installed badge and tooltip driven by `WengineHelper.isWallpaperInstalled` |
| `modals` | adds the `steamLogin` and `addDownloadAccount` modal cases |
| `BrowseWallpapersCtrl` | the main feature surface: daemon browsing, filters, pagination, downloads, extraction, deletion, metadata, accounts, update widget |
| `utils` | tag translation, language helpers, quieter error toasts, `canUseDiscover` disabled |
| `host` | suppresses the `queryWorkshopCallback` error toast |
| `EditorEffectListModalCtrl` | opens author profile links through the platform browser |

The bodies inside the IIFEs are copies of the upstream registrations. They must stay verbatim so the
patched result remains auditable against the build it was derived from; a WEP-only change is a small
delta inside the copied block, not a rewrite.

### Templates

The run block replaces ten templates:

| Template | Surface |
|---|---|
| `views/templates/titlebar.html` | title bar and the WEngine+ version/update widget |
| `views/modals/steamloginmodal.html` | Steam Workshop login dialog (QR, password, cookie, system) |
| `views/modals/addaccountmodal.html` | add a download account (QR or credentials) |
| `views/views/browsewallpapers.html` | browse view: filters, accounts card, download/extract/delete, plugin progress, service banner |
| `views/modals/queryworkshopmodal.html` | editor asset picker with tag chips |
| `views/templates/workshopauthordynamic.html` | author block while the author resolves |
| `views/templates/workshopauthorstatic.html` | author block, static variant |
| `views/templates/workshopratingscore.html` | rating percentage row |
| `views/templates/workshopratingstars.html` | rating stars row |
| `views/views/welcome.html` | first-run wizard including the language picker |

Two of them (`steamloginmodal`, `addaccountmodal`) do not exist in the pristine UI; the others exist
and are overridden by the later `put`.

### Bridge

`window.WengineHelper` is the only way the overlay talks to the daemon. The `url` property is fixed
at `http://127.0.0.1:43196`; `ensureRunning` locates `wengine-helper.exe` next to the scripts and
starts it through `window.ui.shellexecute` when the ping fails. The bridge also owns the installed-id
set, the heartbeat interval and the update state.

| Group | Methods |
|---|---|
| Service | `ping`, `waitForPing`, `ensureRunning`, `startHeartbeat`, `shutdown`, `restart` |
| Accounts | `getAccounts`, `selectAccount`, `addAccount`, `removeAccount`, `startAccountQr`, `pollAccountQr`, `cancelAccountQr` |
| Steam auth | `getAuthStatus`, `loginWithCookie`, `loginSystemAccount` |
| Workshop | `browse`, `getItemDetails`, `downloadItem`, `cancelDownload`, `getDownloadsAll`, `getExtractStatus`, `extractItem`, `pickFolder`, `deleteWallpaper` |
| Metadata | `getAllMetadata`, `saveMetadata`, `deleteMetadata` |
| Plugins | `getPluginStatus`, `ensurePlugins`, `getDotnetStatus`, `ensureDotnet` |
| Updates | `checkUpdate`, `getUpdateStatus`, `startUpdateDownload`, `applyUpdate` |

The endpoint each method calls is listed in [API.md](API.md#overlay-bridge-summary).

### Features in the UI

- **Workshop browser through the daemon.** `BrowseWallpapersCtrl` replaces the engine's own workshop
  query with `WengineHelper.browse`, keeps the engine path as a fallback, and keeps separate
  pagination state for the Installed and Workshop sources.
- **Three-state filter chips.** Category, type, age, resolution, asset type, asset genre, script type,
  miscellaneous and genre tags cycle off → include → exclude; the chip label is translated but the
  value sent to Steam stays the English tag.
- **Installed details and offline metadata.** Size, posted/updated dates, rating, author and tags
  come from `metadata.json` when Steam is unreachable; selection enrichment fetches missing metadata
  in the background.
- **Steam session and download accounts.** The login modal and the account card are in the browse
  toolbar; sessions survive restarts through `steam_session.json`.
- **Download, extract, delete.** Per-item and multi-selection actions, progress toasts, an
  unpacking queue, and active-wallpaper protection: a wallpaper currently applied to the desktop
  cannot be deleted until another one is applied.
- **Plugin and .NET bootstrap.** Progress rows in the toolbar while the plugins and the runtime are
  downloaded; download/extract buttons are disabled until the plugins are ready.
- **Update widget.** The version chip in the title bar runs checks and downloads, and applies an
  update through the daemon.
- **Service banner.** On startup the overlay reports whether the helper is reachable and whether
  Steam login succeeded.

### Localization

The overlay keeps its own strings in `window.WEP_LOCALES`, keyed by Wallpaper Engine language code.
The patched `localeLoader` merges, lowest precedence first:

1. `WEP_LOCALES["en-us"]` — the fallback for every language.
2. `WEP_LOCALES[<current language>]` — the translation table, when one exists.
3. The engine dictionary fetched through `window.global._wpxLocale` / `localeLoaderSupport`.

Because WEP keys are namespaced `ui_wep_`, the engine dictionary can never overwrite them; a language
without a WEP table simply shows English for WEP strings while keeping its own translations. There
are three complete tables with 187 keys each: `en-us`, `ru-ru`, `zh-chs` (Simplified Chinese).
Traditional Chinese (`zh-cht`) is a Wallpaper Engine language but has no WEP table yet and therefore
falls back to English.

Workshop tag labels are resolved by the overlay, not by the daemon. A tag maps to
`ui_workshop_tags_<normalized tag>` in the engine dictionary; the age ratings (`Everyone`,
`Questionable`, `Mature`) map to the engine's `ui_workshop_tags_rating_*` keys; the tags the engine
ships without a string (`3D`, `HDR`, `Puppet Warp`, `Media Integration`, `User Shortcut`,
`Video Texture`) map to `ui_wep_tag_*`. A tag that no dictionary resolves is shown as its English
name, never as a raw `ui_*` key. The filter chips and the installed-metadata pills use the same
lookup, so a chip label and its pill label always agree; the value sent to Steam stays the English
tag regardless.

Conventions:

- Placeholders use AngularJS interpolation (`{{version}}`, `{{count}}`, `{{title}}`, `{{error}}`,
  `{{progress}}`, `{{completed}}`, `{{total}}`, `{{number}}`, `{{name}}`) and must be identical in
  every table.
- Plural forms are separate keys (`_one` / `_many`), not ICU messages.
- Word-order-sensitive sentences are split into `_prefix` / `_suffix` pairs around a spliced value
  (QR brand name, cookie value label, account name).
- Unit symbols (`%`, `#`) are literal inside the value.
- Product names (`Steam`, `Steam Mobile App`, `SteamID`, `Cookie`, `.NET Runtime`, `WEngine+`) stay
  untranslated; the `WEngine+` chip and the daemon-provided progress messages are the documented
  exceptions that the overlay cannot translate (the latter are marked `TODO i18n` in the code).
- The language follows **Settings → General → Language** in Wallpaper Engine and switches without a
  restart; `utils.setLanguage` forwards the code to `$translate.use` and broadcasts a refresh.

## Build and Windows resources

`build.rs` runs `winres` to embed three things into `wengine-helper.exe`:

- the application icon from `assets/app.ico`;
- `VERSIONINFO` derived from `Cargo.toml` — the numeric `FILEVERSION`/`PRODUCTVERSION` and the
  strings Explorer shows all come from `CARGO_PKG_VERSION`, so there is no second version to keep in
  sync;
- a manifest with the Windows 10 compatibility GUID and per-monitor DPI awareness, which also keeps
  the native folder picker crisp on scaled displays.

The resource compiler (`rc.exe`) comes with the Windows SDK that ships with the MSVC build tools;
`winres` locates it. The icon is authored as `assets/app.svg`; `assets/app.png` (1024 px) and
`assets/app.ico` (16–256 px) are exports committed next to it. There is no code signing: releases are
unsigned executables. The updater refuses a release without the SHA-256 digest GitHub publishes for
the zip asset and verifies the downloaded size and digest before extracting the executable.

## Logging and diagnostics

`src/logging.rs` writes one line per event:

```
YYYY-MM-DD HH:MM:SS [LEVEL] message
```

The level is informational only (the logger has no filter). One log file is kept and capped at
8 MiB: when the limit is reached, the older half is dropped down to a line boundary and writing
continues, so the newest entries are always available. The daemon logs startup paths and version,
detected Wallpaper Engine version, bind result, plugin and download outcomes, update steps and
errors. It never logs tokens, cookies, passwords, HTML bodies or file contents — see
[SECURITY.md](../SECURITY.md) for the reporting scope.

Typical diagnostics:

- Daemon not reachable → log startup lines and the bind error.
- Downloads failing → the DepotDownloaderMod output prefix and the attempted account name.
- Extraction failing → no `.pkg` found or RePKG spawn errors.
- Frontend not patched → the scripts directory resolved at startup and the version warning.

## Design conventions

- **Windows only.** Win32 through `windows-sys`; no portability layer and no non-Windows fallback.
- **Single executable, explicit modes.** Every runtime mode is an argument; there is no configuration
  file that changes the mode.
- **The UI never owns state.** Sessions, accounts, metadata, downloads and updates are daemon state;
  the overlay renders and calls.
- **No panics on user input.** Malformed ids, paths and JSON produce an error response, not a panic.
- **Atomic writes for user data.** Metadata goes through a temporary file and rename; the frontend
  files are written with retries.
- **One place per contract.** The loader string lives once in `setup.rs`; routes live once in
  `main.rs`; the token placeholder lives once in `api_security.rs`; UI strings live once in
  `WEP_LOCALES` per language.
- **No telemetry, no cloud.** Network calls are limited to Steam, GitHub, the plugin and runtime
  download URLs, and the local API.
