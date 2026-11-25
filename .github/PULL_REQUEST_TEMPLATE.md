## Summary

<!-- What does this change and why? Link the issue if there is one. -->

## Type

- [ ] Bug fix
- [ ] Feature
- [ ] Refactor or cleanup
- [ ] Documentation
- [ ] Build, CI or release

## Testing

<!-- Commands you ran and any manual steps needed to verify the change. -->

```powershell
cargo check --all-targets
cargo test --all-targets
cargo clippy --all-targets -- -D warnings
node --check frontend/wengine-plus.js
```

## Checklist

- [ ] `cargo check --all-targets`, `cargo test --all-targets`,
      `cargo clippy --all-targets -- -D warnings` and `node --check frontend/wengine-plus.js` pass.
- [ ] New behavior is covered by a unit test next to the code, or the PR explains why it cannot be.
- [ ] `scripts.js` stays pristine apart from the one loader line; no registration is duplicated.
- [ ] Queue-patched blocks keep their verbatim bodies and the payload repeats the registration name.
- [ ] New or changed user-visible strings are in all three `WEP_LOCALES` tables (`en-us`, `ru-ru`,
      `zh-chs`) with identical keys, order and `{{placeholders}}`.
- [ ] A new or changed API route is implemented in `src/main.rs`, exposed through the overlay bridge
      and documented in `docs/API.md`.
- [ ] Documentation was updated in the owning file (READMEs, ARCHITECTURE, API, FAQ, RELEASING); new
      or renamed documents are registered in `docs/README.md`.
- [ ] `README.md`, `README.ru.md` and `README.zh.md` still match, if any of them changed.
- [ ] `NOTICES.md` is updated if dependencies changed, and `Cargo.toml`/`Cargo.lock` are in sync.
- [ ] Logs and errors contain identifiers and outcomes only, no tokens, cookies or passwords.
- [ ] Line endings are LF.

## Screenshots

<!-- For UI changes: before/after or a short clip with secrets removed. Delete this section otherwise. -->
