mod auth;
mod relay;
mod store;

use std::{
    collections::HashMap,
    env,
    net::SocketAddr,
    path::PathBuf,
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};

use axum::{
    extract::{ws::WebSocketUpgrade, FromRequestParts, Path, Query, State},
    http::{request::Parts, HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::{delete, get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tower_http::services::{ServeDir, ServeFile};

use auth::{bearer_token, Authenticator};
use relay::Relay;
use store::{random_hex, Store};

const STARTUP_SCRIPT_TEMPLATE: &str = include_str!("../../umbreonbot/startupscript.sh");

// Long enough to open a socket straight after asking, short enough that a
// ticket leaked through a URL log is already dead.
const TICKET_LIFETIME: Duration = Duration::from_secs(30);

#[derive(Clone)]
struct App {
    relay: Relay,
    store: Store,
    auth: Arc<Authenticator>,
    tickets: Arc<Mutex<HashMap<String, Ticket>>>,
    public_url: Arc<str>,
}

struct Ticket {
    device_id: String,
    expires_at: Instant,
}

struct User(String);

impl FromRequestParts<App> for User {
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, app: &App) -> Result<Self, StatusCode> {
        app.auth
            .user(&parts.headers)
            .await
            .map(User)
            .ok_or(StatusCode::UNAUTHORIZED)
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let assets = PathBuf::from(env::var("ASSETS_DIR").unwrap_or_else(|_| "./assets".into()));
    let database = env::var("DATABASE_PATH").unwrap_or_else(|_| "./umbreon.sqlite".into());
    let port: u16 = env::var("PORT")
        .ok()
        .and_then(|port| port.parse().ok())
        .unwrap_or(3000);
    let public_url =
        env::var("PUBLIC_URL").unwrap_or_else(|_| format!("http://localhost:{port}"));

    let auth = match Authenticator::from_env() {
        Ok(auth) => auth,
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(2);
        }
    };
    let app = App {
        relay: Relay::default(),
        store: Store::open(database.as_ref()).expect("open database"),
        auth: Arc::new(auth),
        tickets: Arc::default(),
        public_url: public_url.trim_end_matches('/').into(),
    };

    // Client-side routes such as /devices/abc/cockpit have no file behind them.
    let web = ServeDir::new(&assets).fallback(ServeFile::new(assets.join("index.html")));

    let router = Router::new()
        .route("/api/devices", get(list_devices).post(create_device))
        .route("/api/devices/{device_id}", delete(delete_device))
        .route("/api/devices/{device_id}/control-ticket", post(create_control_ticket))
        .route("/ws/bot/{device_id}", get(bot_socket))
        .route("/ws/control/{device_id}", get(control_socket))
        .route("/bot/version", get(bot_version))
        .route_service("/bot/download", ServeFile::new(assets.join("umbreonbot")))
        .fallback_service(web)
        .with_state(app);

    let address = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(address)
        .await
        .expect("bind listen address");
    tracing::info!("listening on {address}");
    axum::serve(listener, router).await.expect("serve");
}

#[derive(Serialize)]
struct DeviceSummary {
    id: String,
    name: String,
    online: bool,
    last_seen_ms: Option<i64>,
}

impl DeviceSummary {
    fn new(device: store::Device, relay: &Relay) -> Self {
        Self {
            online: relay.is_online(&device.id),
            id: device.id,
            name: device.name,
            last_seen_ms: device.last_seen_ms,
        }
    }
}

async fn list_devices(
    User(user): User,
    State(app): State<App>,
) -> Result<Json<Vec<DeviceSummary>>, StatusCode> {
    let devices = app.store.list(&user).map_err(internal_error)?;
    Ok(Json(
        devices
            .into_iter()
            .map(|device| DeviceSummary::new(device, &app.relay))
            .collect(),
    ))
}

#[derive(Deserialize)]
struct NewDevice {
    name: String,
}

#[derive(Serialize)]
struct CreatedDevice {
    device: DeviceSummary,
    startup_script: String,
}

async fn create_device(
    User(user): User,
    State(app): State<App>,
    Json(new_device): Json<NewDevice>,
) -> Result<Json<CreatedDevice>, StatusCode> {
    let name = new_device.name.trim();
    if name.is_empty() || name.len() > 64 {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    let (device, token) = app.store.create(&user, name).map_err(internal_error)?;
    let startup_script = STARTUP_SCRIPT_TEMPLATE
        .replace("{{SERVER_URL}}", &app.public_url)
        .replace("{{DEVICE_ID}}", &device.id)
        .replace("{{DEVICE_TOKEN}}", &token);
    Ok(Json(CreatedDevice {
        device: DeviceSummary::new(device, &app.relay),
        startup_script,
    }))
}

async fn delete_device(
    User(user): User,
    Path(device_id): Path<String>,
    State(app): State<App>,
) -> StatusCode {
    if !app.store.delete(&user, &device_id) {
        return StatusCode::NOT_FOUND;
    }
    app.relay.forget(&device_id);
    StatusCode::NO_CONTENT
}

#[derive(Serialize)]
struct ControlTicket {
    ticket: String,
}

// Browsers cannot set headers on a WebSocket, so the page trades its login
// for a ticket here and presents that in the socket URL instead of the token.
async fn create_control_ticket(
    User(user): User,
    Path(device_id): Path<String>,
    State(app): State<App>,
) -> Result<Json<ControlTicket>, StatusCode> {
    if !app.store.is_owner(&user, &device_id) {
        return Err(StatusCode::NOT_FOUND);
    }
    let ticket = random_hex(32);
    let mut tickets = app.tickets.lock().unwrap();
    let now = Instant::now();
    tickets.retain(|_, ticket| ticket.expires_at > now);
    tickets.insert(
        ticket.clone(),
        Ticket {
            device_id,
            expires_at: now + TICKET_LIFETIME,
        },
    );
    Ok(Json(ControlTicket { ticket }))
}

#[derive(Deserialize)]
struct ControlQuery {
    ticket: String,
}

async fn control_socket(
    upgrade: WebSocketUpgrade,
    Path(device_id): Path<String>,
    Query(query): Query<ControlQuery>,
    State(app): State<App>,
) -> Response {
    let ticket = app.tickets.lock().unwrap().remove(&query.ticket);
    let is_valid = ticket
        .is_some_and(|ticket| ticket.device_id == device_id && ticket.expires_at > Instant::now());
    if !is_valid {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    upgrade.on_upgrade(move |socket| app.relay.serve_controller(device_id, socket))
}

async fn bot_socket(
    upgrade: WebSocketUpgrade,
    Path(device_id): Path<String>,
    headers: HeaderMap,
    State(app): State<App>,
) -> Response {
    let is_authorised =
        bearer_token(&headers).is_some_and(|token| app.store.token_matches(&device_id, token));
    if !is_authorised {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    upgrade.on_upgrade(move |socket| async move {
        app.store.mark_seen(&device_id);
        app.relay.clone().serve_bot(device_id.clone(), socket).await;
        app.store.mark_seen(&device_id);
    })
}

async fn bot_version() -> String {
    env::var("BOT_CODE_VERSION").unwrap_or_else(|_| "dev".into())
}

fn internal_error(error: rusqlite::Error) -> StatusCode {
    tracing::error!(%error, "database error");
    StatusCode::INTERNAL_SERVER_ERROR
}
