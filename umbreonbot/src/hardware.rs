use std::time::{Duration, Instant};

use ev3dev_lang_rust::{
    motors::{LargeMotor, MediumMotor, MotorPort},
    sensors::TouchSensor,
    Ev3Result, PowerSupply,
};
use umbreonproto::BotEvent;

pub type HardwareResult<T> = Result<T, String>;

pub trait Hardware {
    fn drive(&mut self, left: i8, right: i8) -> HardwareResult<()>;
    fn move_claw(&mut self, open: bool) -> HardwareResult<()>;
    fn stop(&mut self) -> HardwareResult<()>;
    fn tick(&mut self) -> HardwareResult<()>;
    fn telemetry(&mut self) -> BotEvent;
}

const CLAW_DUTY_CYCLE: i32 = 50;
const CLAW_TIMEOUT: Duration = Duration::from_secs(3);

pub struct Ev3 {
    left: LargeMotor,
    right: LargeMotor,
    claw: MediumMotor,
    touch: Option<TouchSensor>,
    power: Option<PowerSupply>,
    claw_deadline: Option<Instant>,
}

impl Ev3 {
    pub fn connect() -> HardwareResult<Self> {
        let ev3 = Self {
            left: LargeMotor::get(MotorPort::OutD).map_err(describe)?,
            right: LargeMotor::get(MotorPort::OutA).map_err(describe)?,
            claw: MediumMotor::get(MotorPort::OutB).map_err(describe)?,
            touch: TouchSensor::find().ok(),
            power: PowerSupply::new().ok(),
            claw_deadline: None,
        };
        ev3.claw
            .set_polarity(MediumMotor::POLARITY_NORMAL)
            .map_err(describe)?;
        Ok(ev3)
    }

    fn try_drive(&self, left: i8, right: i8) -> Ev3Result<()> {
        // The duty cycle setpoint only takes effect in run-direct mode, and
        // `stop` leaves that mode.
        self.left.run_direct()?;
        self.right.run_direct()?;
        self.left.set_duty_cycle_sp(clamp_duty(left))?;
        self.right.set_duty_cycle_sp(clamp_duty(right))
    }

    fn try_stop(&self) -> Ev3Result<()> {
        self.left.stop()?;
        self.right.stop()?;
        self.claw.stop()
    }
}

impl Hardware for Ev3 {
    fn drive(&mut self, left: i8, right: i8) -> HardwareResult<()> {
        self.try_drive(left, right).map_err(describe)
    }

    fn move_claw(&mut self, open: bool) -> HardwareResult<()> {
        let duty_cycle = if open { CLAW_DUTY_CYCLE } else { -CLAW_DUTY_CYCLE };
        self.claw.run_direct().map_err(describe)?;
        self.claw.set_duty_cycle_sp(duty_cycle).map_err(describe)?;
        self.claw_deadline = Some(Instant::now() + CLAW_TIMEOUT);
        Ok(())
    }

    fn stop(&mut self) -> HardwareResult<()> {
        self.claw_deadline = None;
        self.try_stop().map_err(describe)
    }

    fn tick(&mut self) -> HardwareResult<()> {
        let Some(deadline) = self.claw_deadline else {
            return Ok(());
        };
        // The claw has no position sensor: it is done when it hits its end
        // stop and stalls, or when the timeout says it never will.
        if Instant::now() >= deadline || self.claw.is_stalled().unwrap_or(false) {
            self.claw_deadline = None;
            self.claw.stop().map_err(describe)?;
        }
        Ok(())
    }

    fn telemetry(&mut self) -> BotEvent {
        BotEvent::Telemetry {
            touch_pressed: self
                .touch
                .as_ref()
                .and_then(|touch| touch.get_pressed_state().ok()),
            battery_volts: self
                .power
                .as_ref()
                .and_then(|power| power.get_voltage_now().ok())
                .map(|microvolts| microvolts as f32 / 1_000_000.0),
        }
    }
}

fn clamp_duty(duty_cycle: i8) -> i32 {
    i32::from(duty_cycle).clamp(-100, 100)
}

fn describe(error: ev3dev_lang_rust::Ev3Error) -> String {
    format!("{error:?}")
}

#[derive(Default)]
pub struct Simulated {
    wheels: (i8, i8),
}

impl Hardware for Simulated {
    fn drive(&mut self, left: i8, right: i8) -> HardwareResult<()> {
        if self.wheels != (left, right) {
            println!("[sim] drive left={left} right={right}");
            self.wheels = (left, right);
        }
        Ok(())
    }

    fn move_claw(&mut self, open: bool) -> HardwareResult<()> {
        println!("[sim] claw {}", if open { "open" } else { "close" });
        Ok(())
    }

    fn stop(&mut self) -> HardwareResult<()> {
        if self.wheels != (0, 0) {
            println!("[sim] stop");
            self.wheels = (0, 0);
        }
        Ok(())
    }

    fn tick(&mut self) -> HardwareResult<()> {
        Ok(())
    }

    fn telemetry(&mut self) -> BotEvent {
        BotEvent::Telemetry {
            touch_pressed: Some(false),
            battery_volts: Some(7.9),
        }
    }
}
