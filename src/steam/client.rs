use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ACCEPT_LANGUAGE, COOKIE, USER_AGENT};
use std::time::Duration;

pub struct SteamClient {
    client: reqwest::Client,
}

impl SteamClient {
    pub fn new() -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(15))
            .build()
            .unwrap_or_default();

        Self { client }
    }

    pub async fn fetch_html(&self, url: &str, cookie_header: &str) -> anyhow::Result<String> {
        let mut headers = HeaderMap::new();
        headers.insert(
            USER_AGENT,
            HeaderValue::from_static(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ),
        );
        headers.insert(
            ACCEPT,
            HeaderValue::from_static(
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            ),
        );
        headers.insert(
            ACCEPT_LANGUAGE,
            HeaderValue::from_static("en-US,en;q=0.9,ru;q=0.8"),
        );
        if let Ok(val) = HeaderValue::from_str(cookie_header) {
            headers.insert(COOKIE, val);
        }

        let resp = self.client.get(url).headers(headers).send().await?;
        let status = resp.status();
        if !status.is_success() {
            anyhow::bail!("Steam returned HTTP {status} for {url}");
        }

        let html = resp.text().await?;
        Ok(html)
    }
}
