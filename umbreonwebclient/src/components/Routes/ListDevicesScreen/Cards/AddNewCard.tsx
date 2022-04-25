import { PlusIcon } from '@radix-ui/react-icons'
import {ActionIcon, Button, Card, Center} from "@mantine/core";

interface AddNewCardProps {
}

const AddNewDeviceCardProps = ({}:AddNewCardProps) => {
    return (<Card shadow="md" p="lg">
        <Card.Section>
            <Center>
                <ActionIcon variant='outline' color='blue' size='xl'>
                    <PlusIcon />
                </ActionIcon>
            </Center>
        </Card.Section>

        <Button variant="light" color="blue" fullWidth mt={45}>
            Add New
        </Button>
    </Card>)
}

export default AddNewDeviceCardProps;
