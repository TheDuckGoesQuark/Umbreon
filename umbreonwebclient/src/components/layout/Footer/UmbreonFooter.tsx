import {Anchor, Footer, Group, Navbar, Text} from "@mantine/core";
import {Link} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";

const UmbreonFooter = () => {
    const {isAuthenticated} = useAuth();

    const authenticatedLinks = [
        {label: "Account", href: "/account"},
        {label: "Devices", href: "/devices"}
    ]

    const publicLinks = [
        {label: "About", href: "/about"}
    ]

    const height = 30;
    return <Footer height={height} fixed>
        <Navbar width={{base: '100%'}} height={height} pr={20}>
            <Group spacing='xl' position='right' align='center' direction='row' >
                {isAuthenticated && authenticatedLinks.map(link => (
                    <Anchor component={Link} to={link.href}>
                        {link.label}
                    </Anchor>
                ))}
                {publicLinks.map(link => (
                    <Anchor component={Link} to={link.href}>
                        {link.label}
                    </Anchor>
                ))}

                <Text>Git SHA: {process.env.REACT_APP_GIT_SHA || "local"}</Text>
            </Group>
        </Navbar>
    </Footer>
}

export default UmbreonFooter;