mod hardware;

use std::{
    env,
    io::ErrorKind,
    net::TcpStream,
    thread::sleep,
    time::{Duration, Instant},
};

use tungstenite::{
    client::IntoClientRequest, http::header::AUTHORIZATION, stream::MaybeTlsStream,
    Error as SocketError, Message, WebSocket,
};
use umbreonproto::{to_json, BotEvent, Command, DRIVE_TIMEOUT_MS};

use hardware::{Ev3, Hardware, Simulated};

const POLL_INTERVAL: Duration = Duration::from_millis(50);
const TELEMETRY_INTERVAL: Duration = Duration::from_millis(250);
const RECONNECT_DELAY: Duration = Duration::from_secs(2);

fn main() {
    let server = env::var("UMBREON_SERVER").unwrap_or_else(|_| "http://localhost:3000".into());
    let (Ok(device_id), Ok(token)) = (env::var("UMBREON_DEVICE_ID"), env::var("UMBREON_TOKEN"))
    else {
        eprintln!("UMBREON_DEVICE_ID and UMBREON_TOKEN must be set");
        std::process::exit(2);
    };
    let url = format!(
        "{}/ws/bot/{device_id}",
        server.trim_end_matches('/').replacen("http", "ws", 1)
    );

    let mut hardware: Box<dyn Hardware> = if env::var("UMBREON_SIM").is_ok() {
        Box::new(Simulated::default())
    } else {
        match Ev3::connect() {
            Ok(ev3) => Box::new(ev3),
            Err(error) => {
                eprintln!("EV3 hardware not found ({error}). Set UMBREON_SIM=1 to run without it.");
                std::process::exit(1);
            }
        }
    };

    loop {
        println!("Connecting to {url}");
        if let Err(error) = run_session(&url, &token, hardware.as_mut()) {
            eprintln!("Session ended: {error}");
        }
        if let Err(error) = hardware.stop() {
            eprintln!("Failed to stop motors: {error}");
        }
        sleep(RECONNECT_DELAY);
    }
}

fn run_session(url: &str, token: &str, hardware: &mut dyn Hardware) -> Result<(), String> {
    let mut request = url.into_client_request().map_err(|error| error.to_string())?;
    let bearer = format!("Bearer {token}")
        .parse()
        .map_err(|_| "UMBREON_TOKEN is not a valid header value".to_string())?;
    request.headers_mut().insert(AUTHORIZATION, bearer);
    let (mut socket, _) = tungstenite::connect(request).map_err(|error| error.to_string())?;
    // A short read timeout turns the blocking socket into the loop's clock.
    if let MaybeTlsStream::Plain(stream) = socket.get_ref() {
        stream
            .set_read_timeout(Some(POLL_INTERVAL))
            .map_err(|error| error.to_string())?;
    }
    println!("WAITING for commands");

    send(
        &mut socket,
        &BotEvent::Hello {
            version: env!("CARGO_PKG_VERSION").into(),
        },
    )?;

    let drive_timeout = Duration::from_millis(DRIVE_TIMEOUT_MS);
    let mut driving_since: Option<Instant> = None;
    let mut last_telemetry = Instant::now() - TELEMETRY_INTERVAL;

    loop {
        match socket.read() {
            Ok(Message::Text(text)) => match serde_json::from_str::<Command>(&text) {
                Ok(Command::Drive { left, right }) => {
                    hardware.drive(left, right)?;
                    driving_since = Some(Instant::now());
                }
                Ok(Command::Claw { open }) => hardware.move_claw(open)?,
                Ok(Command::Stop) => {
                    hardware.stop()?;
                    driving_since = None;
                }
                Err(error) => eprintln!("Ignoring unrecognised command {text}: {error}"),
            },
            Ok(Message::Close(_)) => return Ok(()),
            Ok(_) => {}
            Err(SocketError::Io(error))
                if matches!(error.kind(), ErrorKind::WouldBlock | ErrorKind::TimedOut) => {}
            Err(error) => return Err(error.to_string()),
        }

        if driving_since.is_some_and(|since| since.elapsed() > drive_timeout) {
            println!("No drive command for {DRIVE_TIMEOUT_MS}ms, stopping");
            hardware.stop()?;
            driving_since = None;
        }
        hardware.tick()?;

        if last_telemetry.elapsed() >= TELEMETRY_INTERVAL {
            send(&mut socket, &hardware.telemetry())?;
            last_telemetry = Instant::now();
        }
    }
}

fn send(socket: &mut WebSocket<MaybeTlsStream<TcpStream>>, event: &BotEvent) -> Result<(), String> {
    socket
        .send(Message::Text(to_json(event).into()))
        .map_err(|error| error.to_string())
}
