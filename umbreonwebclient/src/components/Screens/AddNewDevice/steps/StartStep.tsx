import {Button, Group, Text, Title} from "@mantine/core";
import {AddDeviceAction} from '../useAddNewDeviceReducer'

interface StartStepProps {
    dispatch:(action:AddDeviceAction)=>void
}

const StartStep = ({dispatch}: StartStepProps) => {
    return <Group direction='column' position='center'>
        <Title align='center' order={3}>Choose:</Title>
        <Group>
            <Button onClick={()=>dispatch(AddDeviceAction.IS_EXISTING_DEVICE)}>I already have the connection code for this device</Button>
            <Text size='sm'>Or</Text>
            <Button onClick={()=>dispatch(AddDeviceAction.IS_NEW_DEVICE)}>I'm setting up this device from scratch</Button>
        </Group>
    </Group>
}

export default StartStep;