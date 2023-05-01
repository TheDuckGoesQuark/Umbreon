import React, {useCallback} from "react";
import {useAuth} from "../../../contexts/AuthContext";
import {Button, Center} from "@mantine/core";
import PageLayout from "../../layout/PageLayout"
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

    return (<PageLayout>
            <Center>
                <Button onClick={onLogin}>Login</Button>
            </Center>
        </PageLayout>
    )
}

export default LoginScreen