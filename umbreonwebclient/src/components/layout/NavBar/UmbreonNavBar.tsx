import {Button, createStyles, Group, MantineTheme, Navbar, Stack, Text, Transition} from "@mantine/core";
import {Link} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";
import {useListDevicesRoute} from "../../Routes/DevicesRoutes";
import {useManageAccountRoute} from "../../Routes/AccountRoutes";
import {useAboutRoute, useLoginRoute, useLogoutRoute} from "../../Routes/PublicRoutes";

const useStyles = createStyles((theme: MantineTheme) => ({
    navButton: {
        margintop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    navBar: {
        padding: theme.spacing.xs,
        height: '100vh'
    }
}));

interface UmbreonNavBarProps {
    navbarOpened: boolean,
}

const UmbreonNavBar = ({navbarOpened}: UmbreonNavBarProps) => {
    const {classes} = useStyles()
    const {isAuthenticated} = useAuth();

    const [, loginRoute] = useLoginRoute();
    const [, logoutRoute] = useLogoutRoute();
    const [, listDevicesRoute] = useListDevicesRoute();
    const [, manageAccountRoute] = useManageAccountRoute();
    const [, aboutRoute] = useAboutRoute();

    const authLinks = isAuthenticated ? [
        {label: "Account", href: manageAccountRoute},
        {label: "Devices", href: listDevicesRoute},
        {label: "Logout", href: logoutRoute}
    ] : [
        {label: "Login", href: loginRoute}
    ]

    const publicLinks = [
        {label: "About", href: aboutRoute}
    ]

    return <Transition transition='slide-right' mounted={navbarOpened} duration={500}>
        {(styles) =>
            <Navbar style={styles} fixed position={{top: 0, left: 0}} hidden={!navbarOpened}
                    width={{sm: 200, lg: 300}} className={classes.navBar}>
                <Navbar.Section grow mt="md" >
                    <Stack justify='center' align='self-start'>
                        {authLinks.map(link => (
                            <Button fullWidth className={classes.navButton} key={link.label} component={Link} to={link.href}>
                                {link.label}
                            </Button>
                        ))}

                        {publicLinks.map(link => (
                            <Button fullWidth className={classes.navButton} key={link.label} component={Link} to={link.href}>
                                {link.label}
                            </Button>
                        ))}

                    </Stack>
                </Navbar.Section>
                <Navbar.Section>
                    <Text>Git SHA: {import.meta.env.VITE_GIT_SHA || "local"}</Text>
                </Navbar.Section>
            </Navbar>}
    </Transition>
}

export default UmbreonNavBar;