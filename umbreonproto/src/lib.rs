use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Command {
    /// Motor duty cycles as a percentage, -100 (full reverse) to 100.
    Drive { left: i8, right: i8 },
    Claw { open: bool },
    Stop,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum BotEvent {
    Hello { version: String },
    Telemetry {
        touch_pressed: Option<bool>,
        battery_volts: Option<f32>,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum ServerEvent {
    DeviceStatus { online: bool },
}

/// A bot that hears no `Drive` for this long stops its motors, so a dropped
/// connection cannot leave it driving. Browsers resend well inside it.
pub const DRIVE_TIMEOUT_MS: u64 = 500;

pub fn to_json<T: Serialize>(message: &T) -> String {
    serde_json::to_string(message).expect("protocol messages serialize")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn command_wire_format_is_tagged_snake_case() {
        assert_eq!(
            to_json(&Command::Drive { left: 50, right: -50 }),
            r#"{"type":"drive","left":50,"right":-50}"#
        );
        assert_eq!(to_json(&Command::Stop), r#"{"type":"stop"}"#);
    }

    #[test]
    fn rejects_duty_cycle_outside_i8() {
        assert!(serde_json::from_str::<Command>(r#"{"type":"drive","left":500,"right":0}"#).is_err());
    }
}
