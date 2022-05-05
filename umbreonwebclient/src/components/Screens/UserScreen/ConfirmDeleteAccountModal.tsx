import {Button, Group, Modal, Text, Title} from '@mantine/core'
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
        <Group direction='column' align='center' position='center'>
            <Text>This action cannot be undone</Text>
            <Button color='red' onClick={onDelete}>Delete my account</Button>
        </Group>
    </Modal>
}

export default ConfirmDeleteAccountModal;