import {
    Badge,
    Button,
    Image,
    Text,
    Card,
    Group,
    useMantineTheme,
    AspectRatio,
    ActionIcon,
} from "@mantine/core";
import {LoopIcon, GearIcon} from "@radix-ui/react-icons";
import moment from "moment";
import {useControlDeviceRoute, useManageDeviceRoute} from "../../../Routes/DevicesRoutes";

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
    const goToManageDeviceScreen = useManageDeviceRoute(deviceId);
    const goToControlDeviceScreen = useControlDeviceRoute(deviceId);

    const statusColors: Record<DeviceState, string> = {
        [DeviceState.Available]: 'green',
        [DeviceState.Busy]: 'red',
        [DeviceState.Offline]: 'orange',
    }

    const isAvailable = deviceState === DeviceState.Available;

    const lastConnectedString = moment(deviceLastConnected).fromNow()

    return (<Card>
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

        <Group position='center' direction='column' align='center' spacing='xs'>
            <Text weight={200} size="sm">
                Last Connected
            </Text>
            <Text size="sm">
                {lastConnectedString}
            </Text>
        </Group>

        <Group mt={14} mb={0} position='center' direction='row'>
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
                <GearIcon/>
            </ActionIcon>
            <ActionIcon color='blue'
                    onClick={() => goToManageDeviceScreen()}
            >
                <LoopIcon/>
            </ActionIcon>
        </Group>
    </Card>)
}

export default DeviceCard;
