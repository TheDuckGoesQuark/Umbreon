import {ActionIcon, Card, Center, createStyles, MantineTheme} from "@mantine/core";
import {useAddNewDeviceRoute} from "../../../Routes/DevicesRoutes";
import {Plus} from "tabler-icons-react";

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
                <Plus/>
            </ActionIcon>
        </Center>
    </Card>)
}

export default AddNewDeviceCardProps;
