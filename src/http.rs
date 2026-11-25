//! Shared outbound HTTP client.
//!
//! Building a `reqwest::Client` per call throws away connection pooling and
//! re-negotiates TLS every time, so the daemon keeps one client for its whole
//! lifetime. Individual requests override the timeout they need.

use std::time::Duration;

/// User agent used for third-party downloads; some CDNs behave differently
/// towards unknown clients.
pub const BROWSER_UA: &str =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/// Builds the daemon-wide client. There is no total timeout on purpose:
/// downloads of large archives may legitimately take minutes, so callers set
/// `RequestBuilder::timeout` where a bound is needed.
pub fn build_client() -> reqwest::Result<reqwest::Client> {
    reqwest::Client::builder()
        .connect_timeout(Duration::from_secs(15))
        .user_agent(format!("WEngine-Plus/{}", env!("CARGO_PKG_VERSION")))
        .build()
}
