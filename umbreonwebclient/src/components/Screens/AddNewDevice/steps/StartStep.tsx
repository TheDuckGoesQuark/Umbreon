import {Button, Group, Text, Title} from "@mantine/core";
import {AddDeviceAction} from '../useAddNewDeviceReducer'

interface StartStepProps {
    dispatch: (action: AddDeviceAction) => void
}

const StartStep = ({dispatch}: StartStepProps) => {
    return <Group direction='row' position='center' align='center'>
        <Button fullWidth onClick={() => dispatch(AddDeviceAction.IS_EXISTING_DEVICE)}>
            I already have the connection code for this device
        </Button>
        <Text align='center' size='sm'>Or</Text>
        <Button fullWidth onClick={() => dispatch(AddDeviceAction.IS_NEW_DEVICE)}>
            I'm setting up this device from scratch
        </Button>
    </Group>
}

export default StartStep;