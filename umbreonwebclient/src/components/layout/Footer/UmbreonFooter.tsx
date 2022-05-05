import {Anchor, Footer, Group, Text} from "@mantine/core";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";
import {useListDevicesRoute} from "../../Routes/DevicesRoutes";
import {useManageAccountRoute} from "../../Routes/AccountRoutes";
import {useAboutRoute, useLoginRoute} from "../../Routes/PublicRoutes";

const UmbreonFooter = () => {
    const {isAuthenticated} = useAuth();
    const location = useLocation();
    const [, loginRoute] = useLoginRoute();
    const [, listDevicesRoute] = useListDevicesRoute();
    const [, manageAccountRoute] = useManageAccountRoute();
    const [, aboutRoute] = useAboutRoute();

    const authLinks = isAuthenticated ? [
        {label: "Account", href: manageAccountRoute},
        {label: "Devices", href: listDevicesRoute}
    ] : [
        {label: "Login", href: loginRoute}
    ]

    const publicLinks = [
        {label: "About", href: aboutRoute}
    ]

    const allLinks = [...authLinks, ...publicLinks]
        .filter(({href}) => href !== location.pathname);

    const height = 30;
    return <Footer height={height}>
        <Group position='apart' pl={20} pr={20}>
            <Group spacing='xl' position='left' align='center' direction='row'>
                <Text>Git SHA: {process.env.REACT_APP_GIT_SHA || "local"}</Text>
            </Group>
            <Group spacing='xl' position='right' align='center' direction='row'>
                {allLinks.map(link => (
                    <Anchor key={link.label} component={Link} to={link.href}>
                        {link.label}
                    </Anchor>
                ))}
            </Group>
        </Group>
    </Footer>
}

export default UmbreonFooter;