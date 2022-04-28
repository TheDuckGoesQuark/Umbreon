import React, {useCallback} from "react";
import {useAuth} from "../../../contexts/AuthContext";
import {Button, Center, Container} from "@mantine/core";
import UmbreonHeader from "../../layout/Header/UmbreonHeader";
import UmbreonFooter from "../../layout/Footer/UmbreonFooter";
import {useLocation} from "react-router-dom";

type LocationState = {
    returnTo: string,
}

const LoginScreen = () => {
    const location = useLocation();
    const auth = useAuth();

    const onLogin = useCallback(async () => {
        await auth.login(location.state ? (location.state as LocationState).returnTo : undefined);
    }, [auth, location.state]);

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