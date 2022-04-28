import './styles.css';
import React, {useCallback} from "react";
import {useAuth} from "../../../contexts/AuthContext";
import {Button, Center, Container, Footer} from "@mantine/core";
import UmbreonHeader from "../../layout/Header/UmbreonHeader";
import UmbreonFooter from "../../layout/Footer/UmbreonFooter";

const LoginScreen = () => {
    const auth = useAuth();

    const onLogin = useCallback(() => {
        auth.login();
    }, [auth]);

    return (
        <Container sx={()=>({height: '100vh'})} fluid>
            <UmbreonHeader />
            <Center sx={()=>({height: '80vh'})}>
                <Button onClick={onLogin}>Login</Button>
            </Center>
            <UmbreonFooter />
        </Container>
    )
}

export default LoginScreen