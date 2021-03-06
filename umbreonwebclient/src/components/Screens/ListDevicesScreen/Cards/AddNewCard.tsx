import {PlusIcon} from '@radix-ui/react-icons'
import {ActionIcon, Card, Center, createStyles, MantineTheme} from "@mantine/core";
import {useAddNewDeviceRoute} from "../../../Routes/DevicesRoutes";

const useStyles = createStyles((theme: MantineTheme) => ({
    card: {
        cursor: 'pointer',
    },
}));

const AddNewDeviceCardProps = () => {
    const {classes} = useStyles();
    const goToNewDevice = useAddNewDeviceRoute();

    // TODO make show click cursor on hover
    return (<Card onClick={() => goToNewDevice()} className={classes.card}>
        <Center>
            <ActionIcon variant='filled' color='blue' size='xl'>
                <PlusIcon/>
            </ActionIcon>
        </Center>
    </Card>)
}

export default AddNewDeviceCardProps;
