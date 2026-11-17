use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use axum::extract::ws::{Message, WebSocket};
use tokio::sync::{broadcast, mpsc};
use umbreonproto::{to_json, BotEvent, Command, ServerEvent};

#[derive(Clone, Default)]
pub struct Relay {
    devices: Arc<Mutex<HashMap<String, Device>>>,
    next_connection: Arc<Mutex<u64>>,
}

struct Device {
    bot: Option<BotLink>,
    events: broadcast::Sender<String>,
    hello: Option<String>,
}

struct BotLink {
    connection: u64,
    commands: mpsc::UnboundedSender<Command>,
}

impl Relay {
    pub fn is_online(&self, device_id: &str) -> bool {
        self.devices
            .lock()
            .unwrap()
            .get(device_id)
            .is_some_and(|device| device.bot.is_some())
    }

    pub fn forget(&self, device_id: &str) {
        self.devices.lock().unwrap().remove(device_id);
    }

    pub async fn serve_bot(self, device_id: String, mut socket: WebSocket) {
        let connection = {
            let mut next = self.next_connection.lock().unwrap();
            *next += 1;
            *next
        };
        let (commands, mut pending) = mpsc::unbounded_channel();
        let events = self.with_device(&device_id, |device| {
            // A reconnecting bot replaces its stale link; dropping the old
            // sender ends the old socket's loop.
            device.bot = Some(BotLink { connection, commands });
            device.events.clone()
        });
        tracing::info!(device_id, "bot connected");
        let _ = events.send(to_json(&ServerEvent::DeviceStatus { online: true }));

        loop {
            tokio::select! {
                command = pending.recv() => {
                    let Some(command) = command else { break };
                    if socket.send(Message::Text(to_json(&command).into())).await.is_err() {
                        break;
                    }
                }
                frame = socket.recv() => {
                    let Some(Ok(frame)) = frame else { break };
                    let Message::Text(text) = frame else { continue };
                    let Ok(event) = serde_json::from_str::<BotEvent>(&text) else {
                        tracing::warn!(device_id, %text, "ignoring unrecognised bot message");
                        continue;
                    };
                    self.with_device(&device_id, |device| {
                        if matches!(event, BotEvent::Hello { .. }) {
                            device.hello = Some(text.to_string());
                        }
                    });
                    let _ = events.send(text.to_string());
                }
            }
        }

        let still_current = self.with_device(&device_id, |device| {
            let ours = device
                .bot
                .as_ref()
                .is_some_and(|bot| bot.connection == connection);
            if ours {
                device.bot = None;
                device.hello = None;
            }
            ours
        });
        if still_current {
            tracing::info!(device_id, "bot disconnected");
            let _ = events.send(to_json(&ServerEvent::DeviceStatus { online: false }));
        }
    }

    pub async fn serve_controller(self, device_id: String, mut socket: WebSocket) {
        let (mut events, online, hello) = self.with_device(&device_id, |device| {
            (device.events.subscribe(), device.bot.is_some(), device.hello.clone())
        });
        let status = to_json(&ServerEvent::DeviceStatus { online });
        for frame in [Some(status), hello].into_iter().flatten() {
            if socket.send(Message::Text(frame.into())).await.is_err() {
                return;
            }
        }

        loop {
            tokio::select! {
                event = events.recv() => {
                    match event {
                        Ok(text) => {
                            if socket.send(Message::Text(text.into())).await.is_err() {
                                break;
                            }
                        }
                        // Telemetry is periodic, so a slow browser skips ahead.
                        Err(broadcast::error::RecvError::Lagged(_)) => continue,
                        Err(broadcast::error::RecvError::Closed) => break,
                    }
                }
                frame = socket.recv() => {
                    let Some(Ok(frame)) = frame else { break };
                    let Message::Text(text) = frame else { continue };
                    let Ok(command) = serde_json::from_str::<Command>(&text) else {
                        tracing::warn!(device_id, %text, "ignoring unrecognised command");
                        continue;
                    };
                    self.with_device(&device_id, |device| {
                        if let Some(bot) = &device.bot {
                            let _ = bot.commands.send(command);
                        }
                    });
                }
            }
        }
    }

    fn with_device<T>(&self, device_id: &str, action: impl FnOnce(&mut Device) -> T) -> T {
        let mut devices = self.devices.lock().unwrap();
        let device = devices
            .entry(device_id.to_owned())
            .or_insert_with(|| Device {
                bot: None,
                events: broadcast::channel(64).0,
                hello: None,
            });
        action(device)
    }
}
