use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine;
use parking_lot::RwLock;
use qrcode::render::svg;
use qrcode::QrCode;
use rand::distributions::Alphanumeric;
use rand::Rng;
use rsa::{BigUint, Pkcs1v15Encrypt, RsaPublicKey};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AuthSession {
    pub steamid: String,
    pub access_token: String,
    pub refresh_token: String,
    pub sessionid: String,
    pub steam_login_secure: String,
    pub persona_name: Option<String>,
    pub avatar_url: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AuthStatus {
    pub logged_in: bool,
    pub is_logging_in: bool,
    pub steamid: Option<String>,
    pub persona_name: Option<String>,
    pub avatar_url: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct QrBeginResult {
    pub client_id: String,
    pub request_id: String,
    pub challenge_url: String,
    pub qr_svg: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct QrPollResult {
    pub status: String, // "waiting", "success", "expired", "error"
    pub session: Option<AuthStatus>,
    pub error: Option<String>,
}

pub struct AuthManager {
    session: Arc<RwLock<Option<AuthSession>>>,
    storage_path: PathBuf,
    is_logging_in: Arc<AtomicBool>,
}

impl AuthManager {
    pub fn new(storage_dir: &Path) -> Self {
        let storage_path = storage_dir.join("steam_session.json");
        let initial_session = if storage_path.exists() {
            fs::read_to_string(&storage_path)
                .ok()
                .and_then(|data| serde_json::from_str::<AuthSession>(&data).ok())
        } else {
            None
        };

        Self {
            session: Arc::new(RwLock::new(initial_session)),
            storage_path,
            is_logging_in: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn get_status(&self) -> AuthStatus {
        let is_logging_in = self.is_logging_in.load(Ordering::SeqCst);
        let guard = self.session.read();
        if let Some(ref s) = *guard {
            AuthStatus {
                logged_in: true,
                is_logging_in,
                steamid: Some(s.steamid.clone()),
                persona_name: s.persona_name.clone(),
                avatar_url: s.avatar_url.clone(),
            }
        } else {
            AuthStatus {
                logged_in: false,
                is_logging_in,
                steamid: None,
                persona_name: None,
                avatar_url: None,
            }
        }
    }

    pub fn get_cookie_header(&self) -> String {
        let mut cookies = "Steam_Language=english; mature_content=1; wants_mature_content=1; birthtime=283996801; lastagecheckage=1-0-1990; ".to_string();
        let guard = self.session.read();
        if let Some(ref s) = *guard {
            cookies.push_str(&format!(
                "steamLoginSecure={}; sessionid={}; ",
                s.steam_login_secure, s.sessionid
            ));
        }
        cookies
    }

    pub async fn begin_qr(&self) -> anyhow::Result<QrBeginResult> {
        let client = reqwest::Client::new();
        let resp = client
            .post("https://api.steampowered.com/IAuthenticationService/BeginAuthSessionViaQR/v1/")
            .form(&[
                ("device_friendly_name", "WallpaperEngine"),
                ("platform_type", "2"),
            ])
            .send()
            .await?
            .json::<serde_json::Value>()
            .await?;

        let response = resp
            .get("response")
            .ok_or_else(|| anyhow::anyhow!("Missing response field"))?;
        let client_id = response
            .get("client_id")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("Missing client_id"))?
            .to_string();
        let challenge_url = response
            .get("challenge_url")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("Missing challenge_url"))?
            .to_string();
        let request_id = response
            .get("request_id")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("Missing request_id"))?
            .to_string();

        let qr = QrCode::new(challenge_url.as_bytes())?;
        let qr_svg = qr
            .render::<svg::Color>()
            .min_dimensions(220, 220)
            .build();

        Ok(QrBeginResult {
            client_id,
            request_id,
            challenge_url,
            qr_svg,
        })
    }

    pub async fn poll_qr(&self, client_id: &str, request_id: &str) -> QrPollResult {
        let client = reqwest::Client::new();
        let resp = match client
            .post("https://api.steampowered.com/IAuthenticationService/PollAuthSessionStatus/v1/")
            .form(&[("client_id", client_id), ("request_id", request_id)])
            .send()
            .await
        {
            Ok(r) => match r.json::<serde_json::Value>().await {
                Ok(j) => j,
                Err(e) => {
                    return QrPollResult {
                        status: "error".to_string(),
                        session: None,
                        error: Some(e.to_string()),
                    }
                }
            },
            Err(e) => {
                return QrPollResult {
                    status: "error".to_string(),
                    session: None,
                    error: Some(e.to_string()),
                }
            }
        };

        let response = match resp.get("response") {
            Some(r) => r,
            None => {
                return QrPollResult {
                    status: "error".to_string(),
                    session: None,
                    error: Some("Invalid response from Steam".to_string()),
                }
            }
        };

        if let Some(access_token) = response.get("access_token").and_then(|v| v.as_str()) {
            let refresh_token = response
                .get("refresh_token")
                .and_then(|v| v.as_str())
                .unwrap_or("")
                .to_string();

            let parts: Vec<&str> = access_token.split('.').collect();
            if parts.len() < 2 {
                return QrPollResult {
                    status: "error".to_string(),
                    session: None,
                    error: Some("Malformed JWT access_token".to_string()),
                };
            }

            let payload_bytes = match URL_SAFE_NO_PAD.decode(parts[1]) {
                Ok(b) => b,
                Err(e) => {
                    return QrPollResult {
                        status: "error".to_string(),
                        session: None,
                        error: Some(format!("Failed to decode JWT: {e}")),
                    }
                }
            };

            let jwt: serde_json::Value = match serde_json::from_slice(&payload_bytes) {
                Ok(v) => v,
                Err(e) => {
                    return QrPollResult {
                        status: "error".to_string(),
                        session: None,
                        error: Some(format!("Failed to parse JWT: {e}")),
                    }
                }
            };

            let steamid = match jwt["sub"].as_str() {
                Some(s) => s.to_string(),
                None => {
                    return QrPollResult {
                        status: "error".to_string(),
                        session: None,
                        error: Some("JWT missing sub/steamid".to_string()),
                    }
                }
            };

            let steam_login_secure = format!("{}%7C%7C{}", steamid, access_token);
            let sessionid: String = rand::thread_rng()
                .sample_iter(&Alphanumeric)
                .take(32)
                .map(char::from)
                .collect::<String>()
                .to_lowercase();

            // Try to fetch persona name from Steam Community profile
            let mut persona_name = None;
            let mut avatar_url = None;
            let profile_url = format!("https://steamcommunity.com/profiles/{steamid}/?xml=1");
            if let Ok(xml_resp) = client.get(&profile_url).send().await {
                if let Ok(xml_text) = xml_resp.text().await {
                    if let Some(name_cap) = regex::Regex::new(r"<steamID><!\[CDATA\[(.*?)\]\]></steamID>")
                        .unwrap()
                        .captures(&xml_text)
                    {
                        persona_name = Some(name_cap[1].to_string());
                    }
                    if let Some(av_cap) = regex::Regex::new(r"<avatarMedium><!\[CDATA\[(.*?)\]\]></avatarMedium>")
                        .unwrap()
                        .captures(&xml_text)
                    {
                        avatar_url = Some(av_cap[1].to_string());
                    }
                }
            }

            let new_session = AuthSession {
                steamid: steamid.clone(),
                access_token: access_token.to_string(),
                refresh_token,
                sessionid,
                steam_login_secure,
                persona_name: persona_name.clone(),
                avatar_url: avatar_url.clone(),
            };

            // Save to disk
            if let Ok(serialized) = serde_json::to_string_pretty(&new_session) {
                let _ = fs::write(&self.storage_path, serialized);
            }

            *self.session.write() = Some(new_session);

            QrPollResult {
                status: "success".to_string(),
                session: Some(AuthStatus {
                    logged_in: true,
                    is_logging_in: false,
                    steamid: Some(steamid),
                    persona_name,
                    avatar_url,
                }),
                error: None,
            }
        } else {
            QrPollResult {
                status: "waiting".to_string(),
                session: None,
                error: None,
            }
        }
    }

    pub fn set_cookie_session(
        &self,
        steamid: String,
        steam_login_secure: String,
        persona_name: Option<String>,
    ) -> anyhow::Result<AuthStatus> {
        let sessionid: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(32)
            .map(char::from)
            .collect::<String>()
            .to_lowercase();

        let new_session = AuthSession {
            steamid: steamid.clone(),
            access_token: "".to_string(),
            refresh_token: "".to_string(),
            sessionid,
            steam_login_secure,
            persona_name: persona_name.clone(),
            avatar_url: None,
        };

        if let Ok(serialized) = serde_json::to_string_pretty(&new_session) {
            let _ = fs::write(&self.storage_path, serialized);
        }

        *self.session.write() = Some(new_session);

        Ok(AuthStatus {
            logged_in: true,
            is_logging_in: false,
            steamid: Some(steamid),
            persona_name,
            avatar_url: None,
        })
    }

    pub fn logout(&self) {
        *self.session.write() = None;
        let _ = fs::remove_file(&self.storage_path);
    }

    pub async fn login_credentials(&self, username: &str, password: &str) -> anyhow::Result<AuthStatus> {
        self.is_logging_in.store(true, Ordering::SeqCst);
        let res = self.login_credentials_inner(username, password).await;
        self.is_logging_in.store(false, Ordering::SeqCst);
        res
    }

    async fn login_credentials_inner(&self, username: &str, password: &str) -> anyhow::Result<AuthStatus> {
        let client = reqwest::Client::new();
        let key_url = format!(
            "https://api.steampowered.com/IAuthenticationService/GetPasswordRSAPublicKey/v1/?account_name={}",
            username
        );
        let key_resp = client
            .get(&key_url)
            .send()
            .await?
            .json::<serde_json::Value>()
            .await?;
        let resp_obj = key_resp
            .get("response")
            .ok_or_else(|| anyhow::anyhow!("Missing response in RSA key query"))?;
        let mod_hex = resp_obj
            .get("publickey_mod")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("Missing publickey_mod"))?;
        let exp_hex = resp_obj
            .get("publickey_exp")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("Missing publickey_exp"))?;
        let timestamp = resp_obj
            .get("timestamp")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("Missing timestamp"))?;

        let n = BigUint::parse_bytes(mod_hex.as_bytes(), 16)
            .ok_or_else(|| anyhow::anyhow!("Invalid RSA modulus hex"))?;
        let e = BigUint::parse_bytes(exp_hex.as_bytes(), 16)
            .ok_or_else(|| anyhow::anyhow!("Invalid RSA exponent hex"))?;
        let pub_key = RsaPublicKey::new(n, e)?;

        let enc_b64 = {
            let mut rng = rand::thread_rng();
            let enc_bytes = pub_key.encrypt(&mut rng, Pkcs1v15Encrypt, password.as_bytes())?;
            base64::engine::general_purpose::STANDARD.encode(&enc_bytes)
        };

        let begin_resp = client
            .post("https://api.steampowered.com/IAuthenticationService/BeginAuthSessionViaCredentials/v1/")
            .form(&[
                ("account_name", username),
                ("encrypted_password", &enc_b64),
                ("encryption_timestamp", timestamp),
                ("platform_type", "2"),
                ("persistence", "1"),
                ("website_id", "Community"),
            ])
            .send()
            .await?
            .json::<serde_json::Value>()
            .await?;

        let begin_obj = begin_resp
            .get("response")
            .ok_or_else(|| anyhow::anyhow!("Failed to begin auth session via credentials"))?;
        let client_id = begin_obj
            .get("client_id")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("Missing client_id"))?;
        let request_id = begin_obj
            .get("request_id")
            .and_then(|v| v.as_str())
            .ok_or_else(|| anyhow::anyhow!("Missing request_id"))?;

        let poll_res = self.poll_qr(client_id, request_id).await;
        if poll_res.status == "success" && poll_res.session.is_some() {
            Ok(poll_res.session.unwrap())
        } else if let Some(err) = poll_res.error {
            anyhow::bail!("{err}")
        } else {
            anyhow::bail!("Status: {}", poll_res.status)
        }
    }

    pub async fn login_system_account(&self) -> anyhow::Result<AuthStatus> {
        let bundle = crate::accounts::load_builtin_bundle().map_err(|e| anyhow::anyhow!(e))?;
        self.login_credentials(&bundle.parser.0, &bundle.parser.1).await
    }
}

