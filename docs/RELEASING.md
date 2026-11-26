# Releasing WEngine-Plus

How a release is cut: which files change, in what order, and what automation publishes. The
user-facing result is described in the READMEs and in `CHANGELOG.md`; this document covers the
mechanics only.

Releases are cut by maintainers. Contributors land changes through pull requests; they do not bump
the version in `Cargo.toml`, edit `CHANGELOG.md` or push `v*` tags.

## Version source

The version is single-sourced in `Cargo.toml` (`version = "X.Y.Z"`). `build.rs` embeds resources with
`winres`, which derives the numeric `FILEVERSION`/`PRODUCTVERSION` and the version strings Explorer
shows from `CARGO_PKG_VERSION`; do not add a second version there. `Cargo.lock` records the package
version and changes on the same commit.

`env!("CARGO_PKG_VERSION")` is what the daemon reports and compares against GitHub tags. The overlay's
`appUpdate.current_version` fallback in `frontend/wengine-plus.js` must be updated to the same value.
It is only a first frame fallback (the daemon replaces it), but a release that leaves it behind shows
a stale chip until the first status poll.

The release tag must be `v<version>` (for example `v1.4.0`), matching the tag history.

## Changelog entry

`CHANGELOG.md` is read by the release workflow, so the newest section must be complete before the tag
is pushed. Entry shape:

```markdown
## [X.Y.Z](https://github.com/psyattack/WEngine-Plus/compare/v<previous-tag>...vX.Y.Z) - YYYY-MM-DD

### Added
- Short, user-readable line

### Changed
- ...

### Fixed
- ...

<details><summary>Detailed Changelog</summary>

### Fixed
- **scope:** commit-level line (by @author in abc1234)

</details>
```

- The summary sections are written for users, one line per change, no emojis.
- The `<details>` block keeps the commit-level history and author handles.
- The workflow extracts everything between the first `## [` heading and the next one as the GitHub
  release body, so the section must be self-contained and `<previous-tag>` must match the tag of the
  release before this one.

## Steps

1. Pick the SemVer bump: breaking change — major, new feature — minor, fixes only — patch.
2. Update `Cargo.toml`; `Cargo.lock` follows after the next Cargo command.
3. Update the overlay version fallback in `frontend/wengine-plus.js` (see
   [Version source](#version-source)).
4. Write the `CHANGELOG.md` section per [Changelog entry](#changelog-entry).
5. Run the gate on the release commit:

   ```powershell
   cargo check --all-targets
   cargo test --all-targets
   cargo clippy --all-targets -- -D warnings
   node --check frontend/wengine-plus.js
   ```

6. Commit with the release message used in this repository, for example
   `chore(release): bump version to 1.5.0`, including `CHANGELOG.md`, `Cargo.toml`, `Cargo.lock` and
   the overlay. Do not edit `build.rs` for a release: its resources follow `Cargo.toml`.
7. Tag the commit `vX.Y.Z` and push the tag. Pushing `v*` starts the release workflow; the tag name
   must equal `v<Cargo.toml version>` or the workflow aborts.
8. Watch `.github/workflows/release.yml` and verify the published release.

## What CI publishes

`.github/workflows/release.yml` runs on a `v*` tag. A manual `workflow_dispatch` must select the tag
too: the workflow aborts unless `GITHUB_REF_TYPE` is `tag` and the ref name equals
`v<Cargo.toml version>`. The job runs on `windows-latest`:

1. `cargo build --release --locked`.
2. The executable's `FileVersion` and `ProductVersion` resources are asserted to equal `<version>.0`
   before anything is packaged; a mismatch (for example a hand-edited `build.rs` version) aborts the
   release.
3. `WEngine-Plus-v<version>-Windows-x64.zip` contains `wengine-helper.exe`, `README.md`, `LICENSE`
   and `NOTICES.md`. **This single `.zip` asset is what the in-app updater downloads**: it extracts
   the executable and requires exactly one zip asset, so do not publish loose executables or a second
   `.zip`.
4. `SHA256SUMS.txt`: lowercase SHA-256 hashes, one per artifact, sorted by file name.
5. Release notes extracted from the first `CHANGELOG.md` section, with a generic fallback.
6. A GitHub Release named `WEngine-Plus vX.Y.Z` with every file from `dist_artifacts/`.

The updater authenticates the archive with the `sha256:<hex>` digest and the `size` that the GitHub
API reports for the asset, and refuses a release without a digest. It then extracts the executable,
requires at least 1 MiB and the `MZ` header, and only then applies the update. There is no signature
check; `SHA256SUMS.txt` remains for manual verification. Changing the archive shape (no
`wengine-helper.exe` entry, more than one zip asset, or a missing digest) breaks the automatic update
path.

## Documentation touch points

- The READMEs use `<version>` placeholders for artifact names, so a version bump does not require an
  edit there.
- A storage-format, API or config change needs a migration note in the new `CHANGELOG.md` section and
  an entry in the FAQ when users must act.
- `SECURITY.md` supports only the latest published release — nothing to change unless that policy
  changes.
- `NOTICES.md` is updated in the feature change that adds, removes or bumps a dependency, not during
  the release.

## If the workflow fails after the tag is pushed

The tag is the trigger, so re-running the job is enough while the tag is correct. If the tag itself
points at the wrong commit, delete the remote tag, fix the release commit locally and push the tag
again; the workflow overwrites the release for that tag. A tag that does not match `Cargo.toml`
aborts before anything is built or published.
