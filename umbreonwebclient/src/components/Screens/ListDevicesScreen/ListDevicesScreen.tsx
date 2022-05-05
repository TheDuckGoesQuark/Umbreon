import React from 'react';
import DeviceCard, {DeviceCardProps, DeviceState} from "./Cards/DeviceCard";
import {Group, SimpleGrid} from "@mantine/core";
import ev3 from '../../../assets/ev3.jpeg';
import AddNewCard from "./Cards/AddNewCard";
import SelfDestructButton from "../../common/SelfDestructButton";

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

    return <SimpleGrid cols={4}>
        {devices.map((device,index) => {
            return <DeviceCard key={index} {...device} />
        })}
        <Group position='center' >
            <AddNewCard />
        </Group>
        <Group position='center' >
            <SelfDestructButton />
        </Group>
    </SimpleGrid>
};

export default ListDevicesScreen;
