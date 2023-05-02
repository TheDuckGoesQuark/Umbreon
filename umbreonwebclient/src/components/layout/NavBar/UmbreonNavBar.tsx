import {
    Avatar,
    Box,
    Button,
    createStyles,
    Group,
    MantineTheme,
    Navbar,
    rem,
    Stack,
    Text,
    Transition, UnstyledButton
} from "@mantine/core";
import {Link} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";
import {useListDevicesRoute} from "../../Routes/DevicesRoutes";
import {useManageAccountRoute} from "../../Routes/AccountRoutes";
import {useAboutRoute, useLoginRoute, useLogoutRoute} from "../../Routes/PublicRoutes";
import UmbreonAvatar from "../Header/UmbreonAvatar";
import {ChevronRight} from "tabler-icons-react";
import {useTheme} from "../../../contexts/ThemeContext";

interface UmbreonNavBarProps {
    navbarOpened: boolean,
}

const UmbreonNavBar = ({navbarOpened}: UmbreonNavBarProps) => {
    const theme = useTheme();
    const {isAuthenticated, user} = useAuth();

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
            <Navbar style={styles} hidden={!navbarOpened}
                    width={{sm: 200, lg: 300}}>
                <Navbar.Section grow pt="md">
                    {authLinks.map(link => (
                        <Button fullWidth key={link.label} component={Link} to={link.href}>
                            {link.label}
                        </Button>
                    ))}

                    {publicLinks.map(link => (
                        <Button fullWidth key={link.label} component={Link} to={link.href}>
                            {link.label}
                        </Button>
                    ))}

                </Navbar.Section>
                <Navbar.Section>
                    <UnstyledButton
                        sx={{
                            paddingTop: theme.spacing.sm,
                            borderTop: `${rem(1)} solid ${
                                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                            }`,
                            width: '100%',
                            padding: theme.spacing.xs,
                            '&:hover': {
                                backgroundColor:
                                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            },
                        }}
                    >
                        <Group noWrap w="100%">
                            <UmbreonAvatar/>
                            <Box sx={{flex: 1}}>
                                <Text size="sm" weight={500}>
                                    {user?.name}
                                </Text>
                                <Text color="dimmed" size="xs">
                                    {user?.email}
                                </Text>
                            </Box>
                            <Box style={{flexGrow: 1}} />
                            <ChevronRight size={rem(18)}/>
                        </Group>
                    </UnstyledButton>
                </Navbar.Section>
                <Navbar.Section>
                    <Text>Git SHA: {import.meta.env.VITE_GIT_SHA || "local"}</Text>
                </Navbar.Section>
            </Navbar>}
    </Transition>
}

export default UmbreonNavBar;