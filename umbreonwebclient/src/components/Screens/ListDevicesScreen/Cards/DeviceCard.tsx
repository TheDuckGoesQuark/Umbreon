import {
    Badge,
    Button,
    Image,
    Text,
    Card,
    Group,
    useMantineTheme,
    AspectRatio,
    ActionIcon, Stack,
} from "@mantine/core";
import moment from "moment";
import {useControlDeviceRoute, useManageDeviceRoute} from "../../../Routes/DevicesRoutes";
import React from "react";
import {Refresh, Settings} from "tabler-icons-react";
import {useCardStyles} from "./AddNewCard";

export enum DeviceState {
    Offline,
    Available,
    Busy,
}

export interface DeviceCardProps {
    imgSrc: string,
    imgAlt: string,
    deviceName: string,
    deviceId: string,
    deviceState: DeviceState,
    deviceLastConnected: Date,
}


const DeviceCard = ({imgSrc, imgAlt, deviceName, deviceId, deviceState, deviceLastConnected}: DeviceCardProps) => {
    const theme = useMantineTheme();
    const {classes} = useCardStyles();
    const goToManageDeviceScreen = useManageDeviceRoute(deviceId);
    const goToControlDeviceScreen = useControlDeviceRoute(deviceId);

    const statusColors: Record<DeviceState, string> = {
        [DeviceState.Available]: 'green',
        [DeviceState.Busy]: 'red',
        [DeviceState.Offline]: 'orange',
    }

    const isAvailable = deviceState === DeviceState.Available;

    const lastConnectedString = moment(deviceLastConnected).fromNow()

    return (<Card withBorder radius="md" shadow="xl" w="100%" className={classes.card}>
        <Card.Section>
            <AspectRatio ratio={800 / 426}>
                <Image src={imgSrc} alt={imgAlt}/>
            </AspectRatio>
        </Card.Section>

        <Group mt={theme.spacing.sm} mb={theme.spacing.sm} position='apart'>
            <Text size='xl' weight={500}>{deviceName}</Text>
            <Badge color={statusColors[deviceState]}>
                {DeviceState[deviceState]}
            </Badge>
        </Group>

        <Stack justify='center' align='center' spacing='xs'>
            <Text weight={200} size="sm">
                Last Connected
            </Text>
            <Text size="sm">
                {lastConnectedString}
            </Text>
        </Stack>

        <Group mt={14} mb={0} position='center' >
            <Button
                disabled={!isAvailable}
                onClick={() => goToControlDeviceScreen()}
                fullWidth
            >
                Connect
            </Button>
            <ActionIcon
                onClick={() => goToManageDeviceScreen()}
            >
                <Settings/>
            </ActionIcon>
            <ActionIcon color='blue'
                    onClick={() => goToManageDeviceScreen()}
            >
                <Refresh/>
            </ActionIcon>
        </Group>
    </Card>)
}

export default DeviceCard;
