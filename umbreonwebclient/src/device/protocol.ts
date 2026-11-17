// Mirrors umbreonproto/src/lib.rs, which defines the wire format.

export type Command =
    | { type: 'drive', left: number, right: number }
    | { type: 'claw', open: boolean }
    | { type: 'stop' };

export type DeviceEvent =
    | { type: 'device_status', online: boolean }
    | { type: 'hello', version: string }
    | { type: 'telemetry', touch_pressed: boolean | null, battery_volts: number | null };

export type Telemetry = Extract<DeviceEvent, { type: 'telemetry' }>;

export interface DeviceSummary {
    id: string,
    name: string,
    online: boolean,
    last_seen_ms: number | null,
}

export interface CreatedDevice {
    device: DeviceSummary,
    startup_script: string,
}

// Must stay well inside umbreonproto's DRIVE_TIMEOUT_MS, or the bot stops mid-drive.
export const DRIVE_RESEND_INTERVAL_MS = 100;
