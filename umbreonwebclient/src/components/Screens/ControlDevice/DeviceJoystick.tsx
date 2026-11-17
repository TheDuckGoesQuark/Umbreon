import {Box, useMantineTheme} from "@mantine/core";
import React, {useEffect, useRef, useState} from "react";
import {Command, DRIVE_RESEND_INTERVAL_MS} from "../../../device/protocol";

interface DeviceJoystickProps {
    disabled: boolean,
    send: (command: Command) => void,
}

interface StickPosition {
    // Both -1 to 1; forward is positive.
    turn: number,
    forward: number,
}

const PAD_SIZE = 240;
const KNOB_SIZE = 64;

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value));

const toDriveCommand = ({turn, forward}: StickPosition): Command => ({
    type: 'drive',
    left: Math.round(clampUnit(forward + turn) * 100),
    right: Math.round(clampUnit(forward - turn) * 100),
});

const DeviceJoystick = ({disabled, send}: DeviceJoystickProps) => {
    const theme = useMantineTheme();
    const [stick, setStick] = useState<StickPosition>();
    const stickRef = useRef<StickPosition>();
    stickRef.current = stick;
    const isHeld = stick !== undefined;

    useEffect(() => {
        if (!isHeld) {
            return;
        }
        const resend = window.setInterval(() => {
            if (stickRef.current) {
                send(toDriveCommand(stickRef.current));
            }
        }, DRIVE_RESEND_INTERVAL_MS);
        return () => {
            window.clearInterval(resend);
            send({type: 'stop'});
        };
    }, [isHeld, send]);

    const moveStick = (event: React.PointerEvent<HTMLDivElement>) => {
        const pad = event.currentTarget.getBoundingClientRect();
        const next = {
            turn: clampUnit((event.clientX - pad.left) / pad.width * 2 - 1),
            forward: clampUnit(1 - (event.clientY - pad.top) / pad.height * 2),
        };
        setStick(next);
        send(toDriveCommand(next));
    };

    const knobOffset = (unit: number) => (unit + 1) / 2 * (PAD_SIZE - KNOB_SIZE);

    return <Box
        role='application'
        aria-label='Drive joystick'
        aria-disabled={disabled}
        onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
            if (disabled) {
                return;
            }
            event.currentTarget.setPointerCapture(event.pointerId);
            moveStick(event);
        }}
        onPointerMove={(event: React.PointerEvent<HTMLDivElement>) => {
            if (isHeld) {
                moveStick(event);
            }
        }}
        onPointerUp={() => setStick(undefined)}
        onPointerCancel={() => setStick(undefined)}
        sx={{
            position: 'relative',
            width: PAD_SIZE,
            height: PAD_SIZE,
            borderRadius: theme.radius.lg,
            border: `2px solid ${theme.colors.gray[6]}`,
            touchAction: 'none',
            userSelect: 'none',
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'grab',
        }}
    >
        <Box sx={{
            position: 'absolute',
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: '50%',
            background: theme.colors.blue[6],
            left: knobOffset(stick?.turn ?? 0),
            top: knobOffset(-(stick?.forward ?? 0)),
            pointerEvents: 'none',
        }}/>
    </Box>
}

export default DeviceJoystick;
