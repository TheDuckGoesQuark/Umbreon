import {Anchor, Button, Code, CopyButton, Group, List, Stack, Text, TextInput} from "@mantine/core";
import {FormEvent, useState} from "react";
import {AddDeviceAction} from '../useAddNewDeviceReducer'
import {CreatedDevice} from "../../../../device/protocol";
import useDeviceApi from "../../../../device/useDeviceApi";

interface NewDeviceSetupStepProps {
    dispatch: (action: AddDeviceAction) => void,
    createdDevice?: CreatedDevice,
    onCreated: (created: CreatedDevice) => void,
}

const SCRIPT_NAME = 'startupscript.sh';

const downloadScript = (script: string) => {
    const url = URL.createObjectURL(new Blob([script], {type: 'text/x-shellscript'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = SCRIPT_NAME;
    link.click();
    URL.revokeObjectURL(url);
}

const NewDeviceSetupStep = ({dispatch, createdDevice, onCreated}: NewDeviceSetupStepProps) => {
    const {createDevice} = useDeviceApi();
    const [name, setName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string>();

    const register = async (event: FormEvent) => {
        event.preventDefault();
        setIsCreating(true);
        setError(undefined);
        try {
            onCreated(await createDevice(name));
        } catch {
            setError('Could not register the device. Try again.');
        } finally {
            setIsCreating(false);
        }
    };

    if (!createdDevice) {
        return <form onSubmit={register}>
            <Stack align='center'>
                <TextInput
                    label='Device name'
                    placeholder='Clawbot'
                    value={name}
                    maxLength={64}
                    error={error}
                    onChange={(event) => setName(event.currentTarget.value)}
                />
                <Button type='submit' loading={isCreating} disabled={name.trim() === ''}>
                    Register device
                </Button>
            </Stack>
        </form>
    }

    const script = createdDevice.startup_script;

    return <Stack align='center'>
        <List type='ordered' withPadding spacing='sm'>
            <List.Item>
                Follow the steps <Anchor href={"https://www.ev3dev.org/docs/getting-started/"}>here</Anchor> to
                set up your device. Make sure it can reach the internet, by Bluetooth tethering or WiFi.
            </List.Item>
            <List.Item>
                Save this script now. It holds the key for <Text span weight={500}>{createdDevice.device.name}</Text> and
                cannot be shown again.
                <Group mt='xs'>
                    <Button variant='light' onClick={() => downloadScript(script)}>Download {SCRIPT_NAME}</Button>
                    <CopyButton value={script}>
                        {({copied, copy}) => <Button variant='subtle' onClick={copy}>
                            {copied ? 'Copied' : 'Copy to clipboard'}
                        </Button>}
                    </CopyButton>
                </Group>
            </List.Item>
            <List.Item>
                Copy it to the device:
                <Code block>{`scp ${SCRIPT_NAME} robot@ev3dev.local:/home/robot/`}</Code>
            </List.Item>
            <List.Item>
                On the device, make it start at every boot:
                <Code block>{`chmod +x ${SCRIPT_NAME} && ./${SCRIPT_NAME} install`}</Code>
            </List.Item>
        </List>
        <Button onClick={() => dispatch(AddDeviceAction.IS_ADDED)}>Device is ready</Button>
    </Stack>
}

export default NewDeviceSetupStep;
