import React from 'react';
import DeviceCard, {DeviceCardProps, DeviceState} from "./Cards/DeviceCard";
import {Center, createStyles, MantineTheme, SimpleGrid} from "@mantine/core";
import ev3 from '../../../assets/ev3.jpeg';
import AddNewCard from "./Cards/AddNewCard";

const useStyles = createStyles((theme: MantineTheme) => ({
    container: {
        maxWidth: theme.breakpoints.md,
        margin: 'auto',
    },
}));

const ListDevicesScreen = () => {
    const {classes} = useStyles();
    const imgSrc = ev3;

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

    return <>
        <SimpleGrid
            className={classes.container}
            cols={4}
            breakpoints={[
                {maxWidth: 'xs', cols: 1},
                {maxWidth: 'sm', cols: 2},
                {maxWidth: 'md', cols: 3}
            ]}
        >
            {devices.map((device, index) => {
                return <DeviceCard key={index} {...device} />
            })}

            <Center m='xl'>
                <AddNewCard/>
            </Center>
        </SimpleGrid>
    </>
};

export default ListDevicesScreen;
