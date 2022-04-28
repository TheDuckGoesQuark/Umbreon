import './styles.css';
import React, {useCallback} from "react";
import {useAuth} from "../../../contexts/AuthContext";
import {Button, Center, Container, Footer} from "@mantine/core";

const LoginScreen = () => {
    const auth = useAuth();

    const onLogin = useCallback(() => {
        auth.login();
    }, [auth]);

    return (
        <Container sx={()=>({height: '100vh'})}>
            <Center sx={()=>({height: '80vh'})}>
                <Button onClick={onLogin}>Login</Button>
            </Center>
            <Footer fixed height={75}>
                <Center>
                    <p>Git SHA: {process.env.REACT_APP_GIT_SHA || "local"}</p>
                </Center>
            </Footer>
        </Container>
    )
}

export default LoginScreen