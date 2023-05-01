import React from 'react';
import DeviceCard, {DeviceCardProps, DeviceState} from "./Cards/DeviceCard";
import {Center, Container, SimpleGrid} from "@mantine/core";
import ev3 from '../../../assets/ev3.jpeg';
import AddNewCard from "./Cards/AddNewCard";
import {useTheme} from "../../../contexts/ThemeContext";

const ListDevicesScreen = () => {
    const imgSrc = ev3;
    const theme = useTheme()

    let devices: DeviceCardProps[] = [
        {
            deviceId: "123",
            deviceLastConnected: new Date(),
            deviceName: "abc",
            deviceState: DeviceState.Available,
            imgAlt: "Device",
            imgSrc
        },
        {
            deviceId: "345",
            deviceLastConnected: new Date(1234),
            deviceName: "def",
            deviceState: DeviceState.Busy,
            imgAlt: "Device",
            imgSrc
        },
        {
            deviceId: "567",
            deviceLastConnected: new Date(978),
            deviceName: "ghi",
            deviceState: DeviceState.Offline,
            imgAlt: "Device",
            imgSrc
        },
    ];
    devices = devices.concat(devices)

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
                {devices.map((device, index) => {
                    return <DeviceCard key={index} {...device} />
                })}

                <Center m='xl'>
                    <AddNewCard/>
                </Center>
            </SimpleGrid>
        </Center>
    </Container>
};

export default ListDevicesScreen;
