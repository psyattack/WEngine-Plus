# Third-Party Notices

WEngine-Plus is distributed under the MIT License (see [LICENSE](LICENSE)). This file lists the
direct dependencies pinned by `Cargo.lock`. All of them except the build-time `winres` are compiled
into the executable; their license texts are reproduced below. Transitive dependencies carry their
own license metadata and are resolved by Cargo.

The Rust sources, the icon (`assets/app.svg`, `assets/app.png`) and the WEngine-Plus-specific overlay
code are original work. The overlay also contains JavaScript copied verbatim from Wallpaper Engine's
frontend in order to replace its AngularJS registrations in place; Wallpaper Engine itself is
proprietary software that this project neither distributes nor licenses — you need your own licensed
copy to use the overlay.

## Runtime downloads

The daemon downloads tools and a runtime on demand. They are **not** bundled with WEngine-Plus and
are governed by their own licenses:

| Component | Source | License |
|---|---|---|
| DepotDownloaderMod | <https://github.com/SteamAutoCracks/DepotDownloaderMod> | GPL-2.0 |
| RePKG | <https://github.com/notscuffed/repkg> | MIT |
| .NET Runtime 9 (portable) | <https://dotnet.microsoft.com/> | MIT |

The default account bundle and Steam actions use Steam's public web endpoints; Steam and Wallpaper
Engine are trademarks of their respective owners and are not part of this project.

`unrar` links RARLAB's UnRAR library, which is distributed under the UnRAR license: it permits
extracting and listing RAR archives but forbids using the library to create a RAR-compatible
archiver. WEngine-Plus only extracts the archives it downloads.

## Direct dependencies

Dual-licensed crates are used under the MIT license, which is why the MIT text is reproduced below.
`scraper` is used under the ISC license; its text follows the MIT text. `tower` is a dev-dependency
and `winres` is a build-time dependency; neither is compiled into the release executable.

| Crate | Version | License | Upstream |
| :--- | :--- | :--- | :--- |
| **aes-gcm** | 0.11.1 | Apache-2.0 OR MIT | [github.com/RustCrypto/AEADs](https://github.com/RustCrypto/AEADs) |
| **anyhow** | 1.0.105 | MIT OR Apache-2.0 | [github.com/dtolnay/anyhow](https://github.com/dtolnay/anyhow) |
| **axum** | 0.8.9 | MIT | [github.com/tokio-rs/axum](https://github.com/tokio-rs/axum) |
| **base64** | 0.23.1 | MIT OR Apache-2.0 | [github.com/marshallpierce/rust-base64](https://github.com/marshallpierce/rust-base64) |
| **once_cell** | 1.21.4 | MIT OR Apache-2.0 | [github.com/matklad/once_cell](https://github.com/matklad/once_cell) |
| **parking_lot** | 0.13.0 | MIT OR Apache-2.0 | [github.com/Amanieu/parking_lot](https://github.com/Amanieu/parking_lot) |
| **qrcode** | 0.15.0 | MIT OR Apache-2.0 | [github.com/kennytm/qrcode-rust](https://github.com/kennytm/qrcode-rust) |
| **rand** | 0.10.4 | MIT OR Apache-2.0 | [github.com/rust-random/rand](https://github.com/rust-random/rand) |
| **regex** | 1.13.2 | MIT OR Apache-2.0 | [github.com/rust-lang/regex](https://github.com/rust-lang/regex) |
| **reqwest** | 0.13.5 | MIT OR Apache-2.0 | [github.com/seanmonstar/reqwest](https://github.com/seanmonstar/reqwest) |
| **rsa** | 0.10.0 | MIT OR Apache-2.0 | [github.com/RustCrypto/RSA](https://github.com/RustCrypto/RSA) |
| **scraper** | 0.29.0 | ISC | [github.com/rust-scraper/scraper](https://github.com/rust-scraper/scraper) |
| **serde** | 1.0.229 | MIT OR Apache-2.0 | [github.com/serde-rs/serde](https://github.com/serde-rs/serde) |
| **serde_json** | 1.0.154 | MIT OR Apache-2.0 | [github.com/serde-rs/json](https://github.com/serde-rs/json) |
| **sha2** | 0.11.2 | MIT OR Apache-2.0 | [github.com/RustCrypto/hashes](https://github.com/RustCrypto/hashes) |
| **sysinfo** | 0.40.4 | MIT | [github.com/GuillaumeGomez/sysinfo](https://github.com/GuillaumeGomez/sysinfo) |
| **tokio** | 1.54.1 | MIT | [github.com/tokio-rs/tokio](https://github.com/tokio-rs/tokio) |
| **tower** (dev) | 0.5.3 | MIT | [github.com/tower-rs/tower](https://github.com/tower-rs/tower) |
| **tower-http** | 0.7.1 | MIT | [github.com/tower-rs/tower-http](https://github.com/tower-rs/tower-http) |
| **unrar** | 0.5.8 | MIT OR Apache-2.0 | [github.com/muja/unrar.rs](https://github.com/muja/unrar.rs) |
| **url** | 2.5.9 | MIT OR Apache-2.0 | [github.com/servo/rust-url](https://github.com/servo/rust-url) |
| **windows-sys** | 0.61.2 | MIT OR Apache-2.0 | [github.com/microsoft/windows-rs](https://github.com/microsoft/windows-rs) |
| **winres** (build) | 0.1.12 | MIT | [github.com/mxre/winres](https://github.com/mxre/winres) |
| **zip** | 9.8.2 | MIT | [github.com/zip-rs/zip2](https://github.com/zip-rs/zip2) |

## License texts

### The MIT License

Applies to every `MIT` or `MIT OR Apache-2.0` dependency above. Each crate's own `LICENSE` file
carries its copyright line.

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### The ISC License

Applies to `scraper`.

```text
Copyright © 2016, June McEnroe <june@causal.agency>
Copyright © 2017, Vivek Kushwaha <yoursvivek@gmail.com>
Copyright © 2024-2025, rust-scraper Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

### The Apache License 2.0

The dual-licensed crates above may also be used under Apache-2.0. WEngine-Plus uses them under MIT
and does not redistribute Apache-licensed code, so the Apache text is not reproduced here; it is
available at <https://www.apache.org/licenses/LICENSE-2.0> and in each crate's distribution.
