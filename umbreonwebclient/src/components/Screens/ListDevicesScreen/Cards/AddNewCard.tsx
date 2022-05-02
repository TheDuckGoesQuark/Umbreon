import {PlusIcon} from '@radix-ui/react-icons'
import {ActionIcon, Card, Center} from "@mantine/core";
import {useAddNewDeviceRoute} from "../../../Routes/DevicesRoutes";

const AddNewDeviceCardProps = () => {
    const goToNewDevice = useAddNewDeviceRoute();

    // TODO make show click cursor on hover
    return (<Card onClick={() => goToNewDevice()}>
        <Center>
            <ActionIcon variant='filled' color='blue' size='xl'>
                <PlusIcon/>
            </ActionIcon>
        </Center>

    </Card>)
}

export default AddNewDeviceCardProps;
