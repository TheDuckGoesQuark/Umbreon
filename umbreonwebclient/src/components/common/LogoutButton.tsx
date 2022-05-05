import {Button} from "@mantine/core";
import React from "react";
import {useLogoutRoute} from "../Routes/PublicRoutes";

const LogoutButton = () => {
    const [goToLogoutRoute] = useLogoutRoute();

    return <Button variant='outline' color='red' onClick={goToLogoutRoute}>
        Logout
    </Button>
}

export default LogoutButton;