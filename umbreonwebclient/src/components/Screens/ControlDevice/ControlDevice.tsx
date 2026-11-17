import React from 'react';
import {useParams} from "react-router-dom";
import DeviceJoystick from './DeviceJoystick'
import {Badge, Button, Group, Stack, Text, Title} from "@mantine/core";
import useDeviceConnection from "../../../device/useDeviceConnection";

const ControlDevice = () => {
    const {deviceId = ''} = useParams();
    const {isServerConnected, isBotOnline, botVersion, telemetry, send} = useDeviceConnection(deviceId);

    const status = !isServerConnected
        ? {color: 'red', label: 'Connecting to server'}
        : isBotOnline
            ? {color: 'green', label: 'Online'}
            : {color: 'orange', label: 'Device offline'};

    return <Stack align='center'>
        <Title align='center' order={2}>{deviceId}</Title>
        <Group>
            <Badge color={status.color}>{status.label}</Badge>
            {isBotOnline && botVersion && <Text size='sm'>Bot version {botVersion}</Text>}
        </Group>

        <DeviceJoystick disabled={!isBotOnline} send={send}/>

        <Group>
            <Button disabled={!isBotOnline} onClick={() => send({type: 'claw', open: true})}>Open claws</Button>
            <Button disabled={!isBotOnline} onClick={() => send({type: 'claw', open: false})}>Close claws</Button>
            <Button disabled={!isBotOnline} color='red' onClick={() => send({type: 'stop'})}>Stop</Button>
        </Group>

        {telemetry && <Group>
            <Text size='sm'>
                Touch sensor: {telemetry.touch_pressed === null ? 'not found' : telemetry.touch_pressed ? 'pressed' : 'released'}
            </Text>
            <Text size='sm'>
                Battery: {telemetry.battery_volts === null ? 'unknown' : `${telemetry.battery_volts.toFixed(1)} V`}
            </Text>
        </Group>}
    </Stack>
};

export default ControlDevice;
