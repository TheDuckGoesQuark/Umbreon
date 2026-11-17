import {Group, Stack, Text} from "@mantine/core";
import {useEffect} from "react";
import {useControlDeviceRoute} from "../../../Routes/DevicesRoutes";

const DELAY_BEFORE_REDIRECT_MS = 1000;

interface SuccessStepProps {
    deviceId: string,
}

const SuccessStep = ({deviceId}: SuccessStepProps) => {
    const goToControlDevice = useControlDeviceRoute(deviceId);

    useEffect(() => {
        const timeout = setTimeout(()=>{
            goToControlDevice();
        }, DELAY_BEFORE_REDIRECT_MS)

        return ()=>clearTimeout(timeout);
    }, [goToControlDevice]);

    return <Stack  justify='center' align='center'>
        <Text>Connected Successfully!</Text>
    </Stack>
}

export default SuccessStep;