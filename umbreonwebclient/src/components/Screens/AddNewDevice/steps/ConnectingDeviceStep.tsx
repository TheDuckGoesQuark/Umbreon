import {Loader, Stack, Text} from "@mantine/core";
import {AddDeviceAction} from '../useAddNewDeviceReducer'
import {useEffect} from "react";
import useDeviceApi from "../../../../device/useDeviceApi";

interface ConnectingNewDeviceStepProps {
    deviceId?: string,
    isActive: boolean,
    nextStepDispatch: (action: AddDeviceAction) => void
}

const ONLINE_POLL_INTERVAL_MS = 2000;

const ConnectingDeviceStep = ({deviceId, isActive, nextStepDispatch}: ConnectingNewDeviceStepProps) => {
    const {listDevices} = useDeviceApi();

    useEffect(() => {
        if (!isActive || !deviceId) {
            return;
        }
        const poll = window.setInterval(async () => {
            const devices = await listDevices().catch(() => []);
            if (devices.some((device) => device.id === deviceId && device.online)) {
                window.clearInterval(poll);
                nextStepDispatch(AddDeviceAction.IS_CONNECTED_SUCCESSFULLY);
            }
        }, ONLINE_POLL_INTERVAL_MS);
        return () => window.clearInterval(poll);
    }, [isActive, deviceId, listDevices, nextStepDispatch]);

    return <Stack justify='center' align='center'>
        <Loader/>
        <Text>Turn on your device. Waiting for it to connect.</Text>
    </Stack>
}

export default ConnectingDeviceStep;
