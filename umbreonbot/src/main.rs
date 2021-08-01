extern crate ev3dev_lang_rust;

use ev3dev_lang_rust::{Ev3Result, Ev3Error};
use ev3dev_lang_rust::motors::{LargeMotor, MotorPort, MediumMotor};
use ev3dev_lang_rust::sensors::{ColorSensor, TouchSensor};
use std::time::Duration;
use std::thread::sleep;

fn main() -> Ev3Result<()> {
    // forward(3)?;

    toggle_claws()?;
    // Find color sensor. Always returns the first recognised one.
    // let color_sensor = ColorSensor::find()?;

    // Switch to rgb mode.
    // color_sensor.set_mode_rgb_raw()?;

    // Get current rgb color tuple.
    // println!("Current rgb color is: {:?}", color_sensor.get_rgb()?);

    Ok(())
}

fn toggle_claws() -> Ev3Result<()> {
    println!("Toggling claws");
    let pressure_sensor = TouchSensor::find()?;
    let pressed = pressure_sensor.get_pressed_state()?;
    let claw_motor = MediumMotor::get(MotorPort::OutB)?;

    if pressed {
        println!("Opening");
        open_claws(claw_motor)?;
    } else {
        println!("Closing");
        close_claws(claw_motor)?;
    }

    Ok(())
}

fn open_claws(claw_motor: MediumMotor) -> Ev3Result<()> {
    claw_motor.set_polarity(MediumMotor::POLARITY_NORMAL)?;
    claw_motor.run_direct()?;
    claw_motor.set_duty_cycle_sp(50)?;
    claw_motor.wait_until_not_moving(Option::Some(Duration::from_secs(3)));
    claw_motor.stop()?;

    Ok(())
}

fn close_claws(claw_motor: MediumMotor) -> Ev3Result<()> {
    claw_motor.set_polarity(MediumMotor::POLARITY_INVERSED)?;
    claw_motor.run_direct()?;
    claw_motor.set_duty_cycle_sp(50)?;
    claw_motor.wait_until_not_moving(Option::Some(Duration::from_secs(3)));
    claw_motor.stop()?;

    Ok(())
}

fn forward(duration_secs: u64) -> Ev3Result<()> {
    let left_motor = LargeMotor::get(MotorPort::OutD)?;
    let right_motor = LargeMotor::get(MotorPort::OutA)?;

    left_motor.run_direct()?;
    right_motor.run_direct()?;

    left_motor.set_duty_cycle_sp(50)?;
    right_motor.set_duty_cycle_sp(50)?;

    sleep(Duration::from_secs(duration_secs));
    left_motor.stop()?;
    right_motor.stop()?;

    Ok(())
}