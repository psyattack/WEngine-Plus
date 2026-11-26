# Security Policy

WEngine-Plus ships a local HTTP service that patches a game's frontend, downloads and executes
third-party tools, and handles Steam sessions and download accounts. Security reports are taken
seriously.

## Supported versions

Security fixes are applied to the latest published release only. Earlier releases do not receive
fixes; upgrade before reporting an issue that may already be fixed.

| Version | Supported |
|---|---|
| Latest published release | Yes |
| Any earlier release | No |

## Reporting a vulnerability

**Do not open a public issue for a security problem.**

Use GitHub's private vulnerability reporting:

1. Open the repository's **Security** tab.
2. Choose **Advisories** → **Report a vulnerability**.
3. Describe the impact and include reproduction steps.

If private reporting is not available, contact the maintainer directly on GitHub
([@psyattack](https://github.com/psyattack)) and ask for a private channel. Never include working
exploit code, credentials, personal data or unrelated user information in a public issue.

Please include:

- WEngine-Plus version and the Wallpaper Engine version (`version.json`);
- Windows version and build (`winver`);
- the configuration needed to reproduce the problem (redact tokens, cookies, account names and
  paths that contain personal data);
- relevant log lines from `<Wallpaper Engine>\ui\dist\scripts\wengine-helper.log` with secrets
  removed;
- expected impact and, if possible, a minimal proof of concept.

## Scope

Reports are especially useful for:

- the local HTTP API (`127.0.0.1:43196`): origin and token checks, CORS, request validation and
  privilege boundaries between the overlay, the daemon and local tools;
- path handling: extraction and deletion targets, canonicalization, reparse points and the
  containment rules around the Wallpaper Engine directory;
- the per-install API token: generation, storage in the scripts directory, embedding into
  `wengine-plus.js` and comparison;
- the installer and patch lifecycle: pristine-base selection, loader injection, elevation through
  `runas`, self-deletion and the uninstaller;
- the updater: release selection, zip download, size and SHA-256 digest verification, archive
  extraction, self-replacement and the silent install path;
- Steam authentication: QR, cookie and credentials flows, the stored `steam_session.json` and the
  handling of download-account passwords;
- unintended disclosure of tokens, cookies, passwords or personal paths in logs, error messages or
  API responses;
- cross-site request forgery against the local API from a page opened in a browser on the same
  machine.

## Out of scope

- Attacks that require an already-administrator attacker, physical access or a compromised Windows
  account.
- Bugs in Windows, Wallpaper Engine, Steam, DepotDownloaderMod, RePKG or .NET.
- Steam account bans, rate limits or terms-of-service consequences of downloading content.
- Moderation of workshop content that a user deliberately downloads.
- Antivirus or SmartScreen reputation warnings for an unsigned executable.
- Inputs that only crash a local debug build without a security impact.

## Safe harbor

Good-faith research is welcome. Keep testing on your own machine and data, do not access other
people's accounts or systems, do not degrade Steam or GitHub services, and give the maintainer
reasonable time to fix the issue before public disclosure. Reports that follow this policy will not
be pursued.

## Response

This is a small project maintained on a best-effort basis; there is no guaranteed response time or
bounty. Acknowledged reports are investigated, fixed in a release where possible, and credited in
the release notes unless you ask to remain anonymous.
