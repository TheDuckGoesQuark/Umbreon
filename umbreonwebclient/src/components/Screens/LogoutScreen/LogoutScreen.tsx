import React, {useEffect} from "react";
import {useAuth} from "../../../contexts/AuthContext";
import {Center, Container, Text} from "@mantine/core";
import {useLoginRoute} from "../../Routes/PublicRoutes";

const LogoutScreen = () => {
    const [goToLogin] = useLoginRoute();
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            goToLogin();
        } else {
            const timeout = setTimeout(async () => {
                await auth.logout()
            }, 1000)
            return () => clearTimeout(timeout);
        }
    }, [auth, goToLogin])

    return (
        <Container sx={() => ({height: '100vh'})} fluid>
            <Center sx={() => ({height: '100vh'})}>
                <Text size='xl'>Logging you out...</Text>
            </Center>
        </Container>
    )
}

export default LogoutScreen