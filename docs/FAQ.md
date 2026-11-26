# FAQ and troubleshooting

Answers to the questions that come up most often. For the API contract see [API.md](API.md), for
internals see [ARCHITECTURE.md](ARCHITECTURE.md), and for the build process see
[../CONTRIBUTING.md](../CONTRIBUTING.md).

<details>
<summary>Contents</summary>

- [Installation and updates](#installation-and-updates)
  - [What does the installer change?](#what-does-the-installer-change)
  - [How do I reinstall after a Wallpaper Engine update?](#how-do-i-reinstall-after-a-wallpaper-engine-update)
  - [How do I update WEngine-Plus?](#how-do-i-update-wengine-plus)
  - [What does the Wallpaper Engine version warning mean?](#what-does-the-wallpaper-engine-version-warning-mean)
  - [Windows SmartScreen or antivirus warns about the download](#windows-smartscreen-or-antivirus-warns-about-the-download)
  - [How do I uninstall completely?](#how-do-i-uninstall-completely)
  - [Do I need the Steam client or Steam running?](#do-i-need-the-steam-client-or-steam-running)
- [Using the overlay](#using-the-overlay)
  - [How do I open the workshop in Wallpaper Engine?](#how-do-i-open-the-workshop-in-wallpaper-engine)
  - [Why is Download disabled?](#why-is-download-disabled)
  - [How do the filters work?](#how-do-the-filters-work)
  - [How do I sign in to Steam?](#how-do-i-sign-in-to-steam)
  - [What are download accounts?](#what-are-download-accounts)
  - [How do I unpack a scene wallpaper?](#how-do-i-unpack-a-scene-wallpaper)
  - [Why can I not delete a wallpaper?](#why-can-i-not-delete-a-wallpaper)
  - [Where do offline details come from?](#where-do-offline-details-come-from)
  - [Which languages are translated?](#which-languages-are-translated)
  - [Why does the helper start by itself?](#why-does-the-helper-start-by-itself)
- [Troubleshooting](#troubleshooting)
  - [The version widget or the filters do not appear](#the-version-widget-or-the-filters-do-not-appear)
  - [The helper does not start](#the-helper-does-not-start)
  - [A download fails or is stuck](#a-download-fails-or-is-stuck)
  - [Extraction fails](#extraction-fails)
  - [Plugin or .NET download fails](#plugin-or-net-download-fails)
  - [Steam returns errors or rate-limits the requests](#steam-returns-errors-or-rate-limits-the-requests)
  - [Where is the log?](#where-is-the-log)
  - [How do I reset the local data?](#how-do-i-reset-the-local-data)
  - [Where do I report a bug or a security issue?](#where-do-i-report-a-bug-or-a-security-issue)

</details>

## Installation and updates

### What does the installer change?

It installs into `<Wallpaper Engine>\ui\dist\scripts`:

- copies `wengine-helper.exe` there and deletes the downloaded copy after exit;
- creates `scripts.js.bak` once;
- appends exactly one loader line to the pristine `scripts.js`;
- writes `wengine-plus.js` with a per-install API token in `wengine-token`;
- starts the daemon and, in silent mode, restarts Wallpaper Engine.

Nothing else on the system is modified: no registry writes, no autostart entry, no
`%LOCALAPPDATA%` folder. See [ARCHITECTURE.md](ARCHITECTURE.md#setup-patching-the-frontend) for the
exact sequence.

### How do I reinstall after a Wallpaper Engine update?

Wallpaper Engine updates replace `scripts.js` with a pristine file, so the overlay stops loading.
Run `wengine-helper.exe` (or the latest release) again: the installer keeps the existing backup and
token, appends the loader to the new pristine file and rewrites `wengine-plus.js`. Steam's "Verify
integrity of game files" works the same way and is safe.

If the installer reports that neither `scripts.js` nor `scripts.js.bak` is pristine, restore
`scripts.js` through Steam (verify integrity), then run the installer again.

### How do I update WEngine-Plus?

The version chip in the Wallpaper Engine title bar checks GitHub Releases. When a newer release
exists it offers an update: the daemon downloads the release zip to
`wengine-helper.exe.update.zip`, verifies its size and the SHA-256 digest published by GitHub,
extracts `wengine-helper.exe`, and on apply replaces itself and runs the new binary with `--silent`.
That patching step restarts Wallpaper Engine and starts the new daemon.

You can also download the latest release zip, extract it and run the executable manually; the
installer overwrites the previous copy. The automatic updater does not verify a signature, but it
does verify the SHA-256 digest GitHub publishes for the release asset and refuses an asset without
one. If you need an independent check, compare the archive with `SHA256SUMS.txt` before running it.

### What does the Wallpaper Engine version warning mean?

The overlay contains copies of Wallpaper Engine UI registrations from the build it was developed
against (`2.8.42`). The installer reads `version.json` and warns when the detected version differs.
The patch usually still applies — the copy is only relevant when the UI changes its AngularJS code.
Everything is developed and tested against `2.8.42` only; other builds will most likely work, but
they are not guaranteed. If the overlay does not appear or the browse view breaks after a Wallpaper
Engine update, check for a newer WEngine-Plus release and, if the latest one still fails, open an
issue with your `version.json` and the relevant log lines.

### Windows SmartScreen or antivirus warns about the download

WEngine-Plus is an unsigned executable distributed through GitHub Releases, and it downloads two
third-party tools. Verify the file before running it:

```powershell
Get-FileHash .\wengine-helper.exe -Algorithm SHA256
```

Compare the result with the matching line in `SHA256SUMS.txt` from the same release. If the hashes
match and the file came from the official release page, the prompt is a reputation warning rather
than a sign of tampering. Do not disable protection for a file whose hash you have not verified.

### How do I uninstall completely?

Run the installed `wengine-helper.exe --uninstall` (add `--silent` for unattended removal). It
restores the frontend by removing the loader line, or copies `scripts.js.bak` back when stripping is
not possible, then deletes `wengine-plus.js`, `wengine-token`, `metadata.json`,
`steam_session.json`, `download_accounts.json`, both log files, `plugins/`, `dotnet/` and finally the
executable itself. Close Wallpaper Engine first so the files are not locked.

### Do I need the Steam client or Steam running?

No. The daemon browses Steam Workshop over HTTPS and downloads content with DepotDownloaderMod using
the accounts configured in the overlay, independent of the Steam client. Wallpaper Engine itself
still needs Steam when it starts, because that is how the game is licensed.

## Using the overlay

### How do I open the workshop in Wallpaper Engine?

Open the Wallpaper Engine browser as usual and select the Workshop section. The overlay replaces the
engine's workshop query with the helper's Steam-backed browser, adds the WEngine+ version chip to the
title bar and adds the filter panel, accounts card and download controls to the browse view. The
Installed section is unchanged except for the added details, extraction and deletion actions.

### Why is Download disabled?

Download and extraction need two tools: DepotDownloaderMod and RePKG, plus a .NET runtime. The
helper downloads them on first use and shows progress in the browse view. The buttons become
available when the plugins report ready. If the download stalls, see
[Plugin or .NET download fails](#plugin-or-net-download-fails).

### How do the filters work?

Most filter chips have three states: off, include (the tag must be present) and exclude (the tag must
be absent). The chip label is translated into the current UI language, but the value sent to Steam is
always the original English tag, so translated and untranslated tags filter identically. Filters are
kept separately for the Installed and Workshop sources, and the search field supports an exact
phrase when the query is wrapped in double quotes.

### How do I sign in to Steam?

Open the Steam session card or the login dialog and pick one of four modes:

- **QR Code** — scan the QR with the Steam mobile app and confirm; the session is stored locally.
- **Username & Password** — sent to Steam over HTTPS after RSA encryption; never written to disk.
- **Cookie** — paste a `steamLoginSecure` value from a browser; the SteamID is detected when present.
- **System Account** — uses the built-in account to obtain a web session without credentials.

Logging in is optional for browsing, but some 18+ content requires a session. The session is stored
in `steam_session.json` next to the scripts and can be removed with "Switch / Log Out".

### What are download accounts?

Wallpaper downloads are performed by DepotDownloaderMod, which needs a Steam account that owns or
can anonymously access the content. The account card stores a list in `download_accounts.json`:

- **Auto** (always present) uses the built-in public pool;
- a custom account you add is used first, and its password is kept only for that entry;
- if no custom account is selected, the built-in pool is tried, then `anonymous`.

You can add an account with a QR login or with a username and password. Passwords are never returned
by the API and are not logged.

### How do I unpack a scene wallpaper?

Installed scene wallpapers that contain a `.pkg` file can be unpacked. Select one or more wallpapers
and use Extract. The unpacker asks for a destination the first time (or uses the wallpaper folder),
runs RePKG and reports progress. Video, web and application wallpapers have no package to unpack and
report that no `.pkg` was found.

### Why can I not delete a wallpaper?

A wallpaper currently applied to a monitor is protected: switching it off and deleting the files
would leave Wallpaper Engine showing a broken background. Apply another wallpaper first, then delete
the old one. Merely selecting or previewing a wallpaper in the browser does not block deletion: the
overlay reverts the preview to the applied wallpaper and then removes the files. Files outside the
known wallpaper folders, and paths that are not wallpapers, are refused for safety.

### Where do offline details come from?

When a wallpaper's details page loads, the daemon stores the metadata in `metadata.json`. The overlay
prefers that local metadata when Steam is unreachable or rate-limiting, so size, dates, rating,
author and tags remain visible. Metadata for wallpapers that no longer exist on disk is pruned when
the daemon starts.

### Which languages are translated?

WEngine-Plus strings follow Wallpaper Engine's language setting. Three complete tables ship:
English (`en-us`), Russian (`ru-ru`) and Simplified Chinese (`zh-chs`). Every other Wallpaper Engine
language keeps its own engine translations and shows English for the WEngine-Plus-only labels
(version widget, extra filters, login dialog, extraction and account strings). Traditional Chinese
(`zh-cht`) is currently in that fallback group.

### Why does the helper start by itself?

The patched frontend starts `wengine-helper.exe --daemon` when Wallpaper Engine starts, and the
overlay also starts it if the local API does not answer. The daemon stops when the Wallpaper Engine
UI closes (or after 15 seconds without a heartbeat), so it does not stay in the background.

## Troubleshooting

### The version widget or the filters do not appear

Check the install:

1. `<Wallpaper Engine>\ui\dist\scripts\scripts.js` must end with
   `document.write('<script src="scripts/wengine-plus.js"><\/script>');`
   and `wengine-plus.js` must exist next to it.
2. Close Wallpaper Engine and run the installer again. A Wallpaper Engine update or a Steam file
   verification replaces `scripts.js`.
3. Open the UI and look at the title bar. If the chip appears but the browse view looks stock,
   check the daemon (next question).

### The helper does not start

- Something else may own `127.0.0.1:43196`. The daemon exits with status 1 and logs
  `address 127.0.0.1:43196 is occupied by another application`. Find the process with
  `Get-NetTCPConnection -LocalPort 43196` and stop it.
- A second helper is not a problem: a healthy running instance makes the new process exit quietly.
- If the daemon exits immediately when Wallpaper Engine closes, that is the intended lifecycle; the
  UI starts it again.
- Check `wengine-helper.log` in the scripts directory for the startup lines and the bind result.

### A download fails or is stuck

DepotDownloaderMod output is streamed into the task status. Common causes:

- the selected account cannot access the item (the daemon retries the next credential automatically,
  waiting up to 20 seconds per account before switching);
- Steam is unreachable or rate-limiting;
- the plugins were still downloading when the download was requested.

Cancel the task and retry. Cancelling removes the partial
`projects\myprojects\<id>` folder only when that task was active. The full DepotDownloaderMod output
is not written to the log; the last status line is shown in the UI.

### Extraction fails

The unpacker only handles scene wallpapers with a `.pkg` file. A wallpaper that is still downloading,
a video/web wallpaper or a folder without a package reports "No .pkg package found". If RePKG itself
fails, the log contains the spawn error; re-running the extraction usually helps after the plugin
download finishes.

### Plugin or .NET download fails

The helper downloads DepotDownloaderMod and RePKG from GitHub and, when no compatible system .NET
(8 or newer) is found, the portable .NET runtime from Microsoft. A proxy, firewall or exhausted
GitHub rate limit breaks this step. Retry from the plugin status area; the helper resumes missing
components and skips the ones that are already installed. `plugins/` and `dotnet/` can be deleted to
force a clean download.

### Steam returns errors or rate-limits the requests

Steam answers the workshop browser with 429 when too many pages are requested quickly. The helper
caches pages for five minutes and prefetches only the next page, and the overlay keeps local metadata
for installed items. Wait a few minutes before retrying; logging in can also raise the rate limit.

### Where is the log?

`<Wallpaper Engine>\ui\dist\scripts\wengine-helper.log`. It is a single file capped at 8 MiB: at the
limit the older half is deleted and only the newest entries remain. The log contains identifiers and
outcomes, never tokens, cookies, passwords or file contents.

### How do I reset the local data?

- **Sessions only:** "Switch / Log Out" in the Steam dialog removes `steam_session.json`.
- **Metadata only:** delete `metadata.json`; it is rebuilt as you browse and install wallpapers.
- **Everything:** run `--uninstall` and install again. The Wallpaper Engine frontend is restored to
  the pristine file first.

### Where do I report a bug or a security issue?

Open an issue on [GitHub](https://github.com/psyattack/WEngine-Plus/issues/new/choose) with the
WEngine-Plus version, the Wallpaper Engine version (`version.json`), Windows build, reproduction
steps and the relevant log lines (remove tokens, paths and account names). For vulnerabilities follow
[SECURITY.md](../SECURITY.md) and report privately.
