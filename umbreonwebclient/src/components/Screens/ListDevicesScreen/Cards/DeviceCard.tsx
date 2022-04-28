import {Badge, Button, Image, Text, Card, Group, useMantineTheme, AspectRatio, ActionIcon, Center} from "@mantine/core";
import {LoopIcon} from "@radix-ui/react-icons";
import moment from "moment";
import {useManageDeviceRoute} from "../../../Routes/DevicesRoutes";

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

    const statusColors: Record<DeviceState, string> = {
        [DeviceState.Available]: 'green',
        [DeviceState.Busy]: 'red',
        [DeviceState.Offline]: 'orange',
    }

    const isAvailable = deviceState === DeviceState.Available;

    const lastConnectedString = moment(deviceLastConnected).fromNow()

    return (<Card shadow="md" p="lg">
        <Card.Section>
            <AspectRatio ratio={800 / 426}>
                <Image src={imgSrc} alt={imgAlt}/>
            </AspectRatio>
        </Card.Section>

        <Group position="apart" style={{marginBottom: 5, marginTop: theme.spacing.sm}}>
            <Text size='xl' weight={500}>{deviceName}</Text>
            <Badge color={statusColors[deviceState]} variant="light">
                {DeviceState[deviceState]}
            </Badge>
        </Group>

        <Text weight={200} align='center' size="sm">
            Last Connected
        </Text>
        <Text align='center' size="sm">
            {lastConnectedString}
        </Text>

        <Center>
            {isAvailable
                ? <Button onClick={()=>goToManageDeviceScreen()} fullWidth style={{marginTop: 14}}> Connect </Button>
                : <ActionIcon size='lg' color='blue' style={{marginTop: 14}}><LoopIcon/></ActionIcon>
            }
        </Center>
    </Card>)
}

export default DeviceCard;
