import React, {useEffect, useState} from 'react';
import DeviceCard, {DeviceCardProps, DeviceState} from "./Cards/DeviceCard";
import {Center, Container, SimpleGrid} from "@mantine/core";
import ev3 from '../../../assets/ev3.jpeg';
import AddNewCard from "./Cards/AddNewCard";
import {useTheme} from "../../../contexts/ThemeContext";
import {DeviceSummary} from "../../../device/protocol";
import useDeviceApi from "../../../device/useDeviceApi";

const DEVICE_LIST_POLL_INTERVAL_MS = 3000;

const ListDevicesScreen = () => {
    const imgSrc = ev3;
    const theme = useTheme()

    const {listDevices} = useDeviceApi();
    const [summaries, setSummaries] = useState<DeviceSummary[]>([]);

    useEffect(() => {
        let isDisposed = false;
        const refresh = () => listDevices()
            .then((devices) => {
                if (!isDisposed) {
                    setSummaries(devices);
                }
            })
            .catch(() => undefined);
        refresh();
        const poll = window.setInterval(refresh, DEVICE_LIST_POLL_INTERVAL_MS);
        return () => {
            isDisposed = true;
            window.clearInterval(poll);
        };
    }, [listDevices]);

    const devices: DeviceCardProps[] = summaries.map((summary) => ({
        deviceId: summary.id,
        deviceName: summary.name,
        deviceState: summary.online ? DeviceState.Available : DeviceState.Offline,
        deviceLastConnected: summary.last_seen_ms === null ? undefined : new Date(summary.last_seen_ms),
        imgAlt: "Device",
        imgSrc,
    }));

    return <Container fluid h="100%">
        <Center>
            <SimpleGrid cols={5} maw={theme.breakpoints.xl} spacing="md" breakpoints={[
                {maxWidth: 'xs', cols: 1},
                {maxWidth: 'sm', cols: 2},
                {maxWidth: 'md', cols: 3},
                {maxWidth: 'lg', cols: 4},
                {maxWidth: 'xl', cols: 5},
            ]}
            >
                {devices.map((device) => {
                    return <DeviceCard key={device.deviceId} {...device} />
                })}

                <Center m='xl'>
                    <AddNewCard/>
                </Center>
            </SimpleGrid>
        </Center>
    </Container>
};

export default ListDevicesScreen;
