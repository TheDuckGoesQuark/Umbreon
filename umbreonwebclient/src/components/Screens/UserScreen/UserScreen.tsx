import React, {useCallback, useState} from 'react';
import {Avatar, Button, Container, Group, Space, Stack, Text, Title} from "@mantine/core";
import {useAuth} from "../../../contexts/AuthContext";
import ConfirmDeleteAccountModal from "./ConfirmDeleteAccountModal";

const UserScreen = () => {
    const {user} = useAuth();

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const closeModal = useCallback(()=>{
        setModalOpen(false);
    }, [setModalOpen])

    const openModal = useCallback(()=>{
        setModalOpen(true);
    }, [setModalOpen])

    return <Container fluid>
        <Stack pt='lg' align='center' justify='center'>
            <Avatar size='xl' src={user?.picture} alt='Avatar'/>

            <Title order={3}>Name</Title>
            <Text>{user?.name}</Text>

            <Title order={3}>Email</Title>
            <Text>{user?.email}</Text>

            <Space pt='xl' />

            <Button color='red' variant='outline' onClick={openModal}>Delete Account</Button>
        </Stack>

        <ConfirmDeleteAccountModal isOpen={modalOpen} close={closeModal} />
    </Container>
};

export default UserScreen;
