import {Button, Group, Modal, Stack, Text, Title} from '@mantine/core'
import {useCallback} from "react";

interface ConfirmDeleteAccountModalProps {
    isOpen: boolean;
    close: ()=>void
}

const ConfirmDeleteAccountModal = ({isOpen, close}:ConfirmDeleteAccountModalProps) => {
    const onDelete = useCallback(()=> {
        close();
    }, [close])

    const title = <Title  order={2}>Are you sure?</Title>;

    return <Modal opened={isOpen} onClose={close} title={title} centered padding='xl'>
        <Stack  align='center' justify='center'>
            <Text>This action cannot be undone</Text>
            <Button color='red' onClick={onDelete}>Delete my account</Button>
        </Stack>
    </Modal>
}

export default ConfirmDeleteAccountModal;