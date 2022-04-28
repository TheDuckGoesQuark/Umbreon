import {Anchor, Footer, Group, Navbar, Text} from "@mantine/core";
import {Link} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";
import {useListDevicesRoute} from "../../Routes/DevicesRoutes";
import {useManageAccountRoute} from "../../Routes/AccountRoutes";

const UmbreonFooter = () => {
    const {isAuthenticated} = useAuth();
    const [, listDevicesRoute] = useListDevicesRoute();
    const [, manageAccountRoute] = useManageAccountRoute();

    const authenticatedLinks = [
        {label: "Account", href: manageAccountRoute},
        {label: "Devices", href: listDevicesRoute}
    ]

    const publicLinks = [
        {label: "About", href: "/about"}
    ]

    const height = 30;
    return <Footer height={height} fixed>
        <Navbar width={{base: '100%'}} height={height} pr={20}>
            <Group spacing='xl' position='right' align='center' direction='row'>
                {isAuthenticated && authenticatedLinks.map(link => (
                    <Anchor key={link.label} component={Link} to={link.href}>
                        {link.label}
                    </Anchor>
                ))}
                {publicLinks.map(link => (
                    <Anchor key={link.label} component={Link} to={link.href}>
                        {link.label}
                    </Anchor>
                ))}

                <Text>Git SHA: {process.env.REACT_APP_GIT_SHA || "local"}</Text>
            </Group>
        </Navbar>
    </Footer>
}

export default UmbreonFooter;