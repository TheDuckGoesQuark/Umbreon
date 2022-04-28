import { PlusIcon } from '@radix-ui/react-icons'
import {ActionIcon, Button, Card, Center} from "@mantine/core";

interface AddNewCardProps {
    addNewCard: ()=>void,
}

const AddNewDeviceCardProps = ({addNewCard}:AddNewCardProps) => {
    return (<Card shadow="md" p="lg">
        <Card.Section>
            <Center>
                <ActionIcon variant='outline' color='blue' size='xl'>
                    <PlusIcon />
                </ActionIcon>
            </Center>
        </Card.Section>

        <Button onClick={addNewCard} variant="light" color="blue" fullWidth mt={45}>
            Add New
        </Button>
    </Card>)
}

export default AddNewDeviceCardProps;
