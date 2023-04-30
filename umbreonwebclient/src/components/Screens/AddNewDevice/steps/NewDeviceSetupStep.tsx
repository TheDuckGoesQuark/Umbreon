import {Anchor, Button, Group, List, Text} from "@mantine/core";
import {AddDeviceAction} from '../useAddNewDeviceReducer'

interface NewDeviceSetupStepProps {
    dispatch: (action: AddDeviceAction) => void
}

const NewDeviceSetupStep = ({dispatch}: NewDeviceSetupStepProps) => {
    // generate new key pair from server with expiry
    // download script to be put on device that uses key pair

    return <Group position='center' align='center'>
        <List listStyleType='numbered' center withPadding>
            <List.Item>
                Follow the steps <Anchor href={"https://www.ev3dev.org/docs/getting-started/"}>here </Anchor>
                to setup your device. Make sure it's able to connect to the internet either
                via bluetooth tethering or directly via WiFi.
            </List.Item>
            <List.Item>
                Download <Text inline>startupscript.sh</Text> or Copy and Paste the following to a file:
                <Text>
                    Script contents
                </Text>
            </List.Item>
            <List.Item>
                Copy the script over
            </List.Item>
        </List>
        <Button onClick={() => dispatch(AddDeviceAction.IS_ADDED)}>Device is ready</Button>
    </Group>
}

export default NewDeviceSetupStep;