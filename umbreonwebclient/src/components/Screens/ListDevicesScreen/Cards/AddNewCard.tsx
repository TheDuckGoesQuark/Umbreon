import {ActionIcon, AspectRatio, Button, Card, Center, createStyles, Group, MantineTheme, Text} from "@mantine/core";
import {useAddNewDeviceRoute} from "../../../Routes/DevicesRoutes";
import {Plus} from "tabler-icons-react";
import React from "react";

export const useCardStyles = createStyles((theme: MantineTheme) => ({
    card: {
        cursor: 'pointer',
        transition: "all ease-in 100ms",
        "&:hover": {
            transform: "scale(1.2)",
            zIndex: 1000,
        }
    },
}));

const AddNewDeviceCardProps = () => {
    const {classes} = useCardStyles();
    const goToNewDevice = useAddNewDeviceRoute();

    return (<Card onClick={() => goToNewDevice()} className={classes.card}>
        <Card.Section>
            <AspectRatio ratio={800/426}>
                <ActionIcon variant='filled' color='blue.9' size='xl'>
                    <Plus/>
                </ActionIcon>
            </AspectRatio>
        </Card.Section>

        <Group mt={14} mb={0} position='center'>
            <Button>
                Add Device
            </Button>
        </Group>
    </Card>)
}

export default AddNewDeviceCardProps;
