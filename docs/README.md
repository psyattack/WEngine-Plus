# WEngine-Plus documentation

This directory holds the detailed documentation. Each topic has one owner; update that file and link
to it instead of copying its content elsewhere.

This index is the only place where the document set is enumerated. Other files link here instead of
keeping their own list.

## Users

| Document | Contents |
|---|---|
| [../README.md](../README.md) | Overview, features, installation, command-line flags, data files and build commands. [Русская версия](../README.ru.md). [简体中文版](../README.zh.md). |
| [FAQ.md](FAQ.md) | Common questions and troubleshooting: installation, updates, the daemon, downloads, extraction, accounts, filters and logs. |
| [API.md](API.md) | The local HTTP API: authentication, every endpoint, request and response shapes, models and error handling. |

## Developers

| Document | Contents |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Process model, setup and patching, daemon subsystems, storage, the frontend overlay and its AngularJS contract. |
| [../CONTRIBUTING.md](../CONTRIBUTING.md) | Contribution workflow, module map, code conventions, tests and the pull-request process. |
| [../SECURITY.md](../SECURITY.md) | Supported versions and private vulnerability reporting. |
| [../CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | Community standards. |

## Releases

| Document | Contents |
|---|---|
| [RELEASING.md](RELEASING.md) | Version source, changelog entry shape, tag flow and what CI publishes. |
| [../CHANGELOG.md](../CHANGELOG.md) | Release history, one section per version. |
| [../NOTICES.md](../NOTICES.md) | Direct dependencies and their license texts. |

## Documentation rules

- **One owner per topic.** Behavior belongs to `ARCHITECTURE.md`, the HTTP surface to `API.md`, user
  questions to `FAQ.md`, release mechanics to `RELEASING.md`.
- **Link, do not copy.** When a detail is already documented in its owner file, reference it. This
  keeps the READMEs and the docs from drifting.
- **Keep all three languages in sync.** `README.md`, `README.ru.md` and `README.zh.md` are mirrors.
  UI strings live in the `ui_wep_*` tables of `frontend/wengine-plus.js` for English, Russian and
  Simplified Chinese.
- **Update this index** when a document is added, renamed or removed.
