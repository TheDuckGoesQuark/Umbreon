import {Group, Text} from "@mantine/core";
import {useEffect} from "react";
import {useManageDeviceRoute} from "../../../Routes/DevicesRoutes";

const DELAY_BEFORE_REDIRECT_MS = 1000;

interface SuccessStepProps {
    deviceId: string,
}

const SuccessStep = ({deviceId}: SuccessStepProps) => {
    const goToManageDevice = useManageDeviceRoute(deviceId);

    useEffect(() => {
        const timeout = setTimeout(()=>{
            goToManageDevice();
        }, DELAY_BEFORE_REDIRECT_MS)

        return ()=>clearTimeout(timeout);
    }, [goToManageDevice]);

    return <Group direction='column' position='center' align='center'>
        <Text>Connected Successfully!</Text>
    </Group>
}

export default SuccessStep;