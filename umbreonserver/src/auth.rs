use std::{
    collections::HashMap,
    env,
    sync::Mutex,
    time::{Duration, Instant},
};

use axum::http::{header::AUTHORIZATION, HeaderMap};
use jsonwebtoken::{decode, decode_header, jwk::JwkSet, Algorithm, DecodingKey, Validation};
use serde::Deserialize;

pub enum Authenticator {
    Dev { user: String },
    Auth0(Auth0),
}

pub struct Auth0 {
    issuer: String,
    audience: String,
    http: reqwest::Client,
    keys: Mutex<KeyCache>,
}

#[derive(Default)]
struct KeyCache {
    by_key_id: HashMap<String, DecodingKey>,
    fetched_at: Option<Instant>,
}

// Tokens naming an unknown key id trigger a refetch, so this bounds how often
// a stream of forged tokens can make the server call Auth0.
const MIN_KEY_REFRESH_INTERVAL: Duration = Duration::from_secs(60);

#[derive(Deserialize)]
struct Claims {
    sub: String,
}

impl Authenticator {
    pub fn from_env() -> Result<Self, String> {
        if let Ok(user) = env::var("UMBREON_DEV_USER") {
            tracing::warn!(user, "UMBREON_DEV_USER is set: every request is treated as this user");
            return Ok(Self::Dev { user });
        }
        let (Ok(domain), Ok(audience)) = (env::var("AUTH0_DOMAIN"), env::var("AUTH0_AUDIENCE"))
        else {
            return Err(
                "set AUTH0_DOMAIN and AUTH0_AUDIENCE, or UMBREON_DEV_USER for local development"
                    .into(),
            );
        };
        Ok(Self::Auth0(Auth0 {
            issuer: format!("https://{domain}/"),
            audience,
            http: reqwest::Client::new(),
            keys: Mutex::default(),
        }))
    }

    pub async fn user(&self, headers: &HeaderMap) -> Option<String> {
        match self {
            Self::Dev { user } => Some(user.clone()),
            Self::Auth0(auth0) => auth0.user(bearer_token(headers)?).await,
        }
    }
}

impl Auth0 {
    async fn user(&self, token: &str) -> Option<String> {
        let key_id = decode_header(token).ok()?.kid?;
        let key = match self.cached_key(&key_id) {
            Some(key) => key,
            None => {
                self.refresh_keys().await;
                self.cached_key(&key_id)?
            }
        };
        verify(token, &key, &self.issuer, &self.audience)
    }

    fn cached_key(&self, key_id: &str) -> Option<DecodingKey> {
        self.keys.lock().unwrap().by_key_id.get(key_id).cloned()
    }

    async fn refresh_keys(&self) {
        {
            let mut keys = self.keys.lock().unwrap();
            if keys
                .fetched_at
                .is_some_and(|at| at.elapsed() < MIN_KEY_REFRESH_INTERVAL)
            {
                return;
            }
            keys.fetched_at = Some(Instant::now());
        }
        let url = format!("{}.well-known/jwks.json", self.issuer);
        let key_set = match self.http.get(&url).send().await {
            Ok(response) => response.json::<JwkSet>().await,
            Err(error) => Err(error),
        };
        match key_set {
            Ok(key_set) => {
                let by_key_id = key_set
                    .keys
                    .iter()
                    .filter_map(|jwk| {
                        let key_id = jwk.common.key_id.clone()?;
                        Some((key_id, DecodingKey::from_jwk(jwk).ok()?))
                    })
                    .collect();
                self.keys.lock().unwrap().by_key_id = by_key_id;
            }
            Err(error) => tracing::error!(%error, url, "failed to fetch signing keys"),
        }
    }
}

pub fn bearer_token(headers: &HeaderMap) -> Option<&str> {
    headers
        .get(AUTHORIZATION)?
        .to_str()
        .ok()?
        .strip_prefix("Bearer ")
}

fn verify(token: &str, key: &DecodingKey, issuer: &str, audience: &str) -> Option<String> {
    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_issuer(&[issuer]);
    validation.set_audience(&[audience]);
    decode::<Claims>(token, key, &validation)
        .ok()
        .map(|token| token.claims.sub)
}

#[cfg(test)]
mod tests {
    use super::*;
    use jsonwebtoken::{encode, EncodingKey, Header};
    use serde_json::json;

    const PRIVATE_KEY: &[u8] = include_bytes!("../tests/test_signing_key.pem");
    const PUBLIC_KEY: &[u8] = include_bytes!("../tests/test_signing_key.pub.pem");
    const ISSUER: &str = "https://tenant.example/";
    const AUDIENCE: &str = "https://api.example";

    fn token(issuer: &str, audience: &str, expires_in_secs: i64) -> String {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;
        encode(
            &Header::new(Algorithm::RS256),
            &json!({"sub": "auth0|alice", "iss": issuer, "aud": audience, "exp": now + expires_in_secs}),
            &EncodingKey::from_rsa_pem(PRIVATE_KEY).unwrap(),
        )
        .unwrap()
    }

    fn verify_with_test_key(token: &str) -> Option<String> {
        let key = DecodingKey::from_rsa_pem(PUBLIC_KEY).unwrap();
        verify(token, &key, ISSUER, AUDIENCE)
    }

    #[test]
    fn accepts_a_valid_token() {
        assert_eq!(
            verify_with_test_key(&token(ISSUER, AUDIENCE, 600)).as_deref(),
            Some("auth0|alice")
        );
    }

    #[test]
    fn rejects_wrong_issuer_audience_or_expiry() {
        assert!(verify_with_test_key(&token("https://evil.example/", AUDIENCE, 600)).is_none());
        assert!(verify_with_test_key(&token(ISSUER, "https://other.example", 600)).is_none());
        assert!(verify_with_test_key(&token(ISSUER, AUDIENCE, -600)).is_none());
    }
}
