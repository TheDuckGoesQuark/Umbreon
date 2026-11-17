mod relay;

use std::{env, net::SocketAddr, path::PathBuf};

use axum::{
    extract::{ws::WebSocketUpgrade, Path, State},
    response::Response,
    routing::get,
    Json, Router,
};
use serde_json::{json, Value};
use tower_http::services::{ServeDir, ServeFile};

use relay::{DeviceSummary, Relay};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let assets = PathBuf::from(env::var("ASSETS_DIR").unwrap_or_else(|_| "./assets".into()));
    let port: u16 = env::var("PORT")
        .ok()
        .and_then(|port| port.parse().ok())
        .unwrap_or(3000);

    // Client-side routes such as /devices/abc/cockpit have no file behind them.
    let web = ServeDir::new(&assets).fallback(ServeFile::new(assets.join("index.html")));

    let app = Router::new()
        .route("/api/devices", get(list_devices))
        .route("/ws/bot/{device_id}", get(bot_socket))
        .route("/ws/control/{device_id}", get(control_socket))
        .route("/bot/version", get(bot_version))
        .route_service("/bot/download", ServeFile::new(assets.join("umbreonbot")))
        .fallback_service(web)
        .with_state(Relay::default());

    let address = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(address)
        .await
        .expect("bind listen address");
    tracing::info!("listening on {address}");
    axum::serve(listener, app).await.expect("serve");
}

async fn list_devices(State(relay): State<Relay>) -> Json<Vec<DeviceSummary>> {
    Json(relay.devices())
}

async fn bot_socket(
    upgrade: WebSocketUpgrade,
    Path(device_id): Path<String>,
    State(relay): State<Relay>,
) -> Response {
    upgrade.on_upgrade(move |socket| relay.serve_bot(device_id, socket))
}

async fn control_socket(
    upgrade: WebSocketUpgrade,
    Path(device_id): Path<String>,
    State(relay): State<Relay>,
) -> Response {
    upgrade.on_upgrade(move |socket| relay.serve_controller(device_id, socket))
}

async fn bot_version() -> Json<Value> {
    let version = env::var("BOT_CODE_VERSION").unwrap_or_else(|_| "dev".into());
    Json(json!({ "version": version }))
}
