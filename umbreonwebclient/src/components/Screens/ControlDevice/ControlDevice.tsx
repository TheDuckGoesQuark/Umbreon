import React from 'react';
import {useParams} from "react-router-dom";
import DeviceJoystick from './DeviceJoystick'
import {Container, Stack, Title} from "@mantine/core";

const ControlDevice = () => {
    const {deviceId} = useParams();

    return <Stack>
        <Title align='center' order={2}>{deviceId}!</Title>
        <Container>
            <DeviceJoystick />
        </Container>
    </Stack>
};

export default ControlDevice;
