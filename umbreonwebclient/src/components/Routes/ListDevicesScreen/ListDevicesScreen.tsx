import React from 'react';
import DeviceCard, {DeviceCardProps, DeviceState} from "./Cards/DeviceCard";
import {Grid} from "@mantine/core";
import ev3 from '../../../assets/ev3.jpeg';
import AddNewCard from "./Cards/AddNewCard";

const ListDevicesScreen = () => {
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

    return <Grid justify='center' align='center' gutter='xl'>
        {devices.map(device => {
            return <Grid.Col md={6} lg={3}>
                <DeviceCard {...device} />
            </Grid.Col>
        })}
        <Grid.Col md={6} lg={3}>
            <AddNewCard addNewCard={() => console.log("")}/>
        </Grid.Col>
    </Grid>
};

export default ListDevicesScreen;
