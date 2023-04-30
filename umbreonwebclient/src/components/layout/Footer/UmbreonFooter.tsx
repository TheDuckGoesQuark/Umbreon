import {Anchor, createStyles, Footer, Group, MantineTheme, Text} from "@mantine/core";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";
import {useListDevicesRoute} from "../../Routes/DevicesRoutes";
import {useManageAccountRoute} from "../../Routes/AccountRoutes";
import {useAboutRoute, useLoginRoute} from "../../Routes/PublicRoutes";

const useStyles = createStyles((theme: MantineTheme) => ({
    footer: {
        // hide footer on tiny screens
        [theme.fn.smallerThan(theme.breakpoints.sm)]: {
            display: 'none'
        },
        paddingLeft: 20,
        paddingRight: 20,
    },
}));

const UmbreonFooter = () => {
    const {classes} = useStyles();
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
    return <Footer height={height} className={classes.footer}>
        <Group position='apart'>
            <Group spacing='xl' position='left' align='center'>
                <Text>Git SHA: {import.meta.env.VITE_GIT_SHA || "local"}</Text>
            </Group>
            <Group spacing='xl' position='right' align='center'>
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