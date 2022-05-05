import {ActionIcon, Title, Button, Group, Header} from "@mantine/core";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";
import {SunIcon, MoonIcon} from "@radix-ui/react-icons";
import {useTheme} from "../../../contexts/ThemeContext";
import UmbreonAvatar from "./UmbreonAvatar";
import {useLogoutRoute} from "../../Routes/PublicRoutes";

const UmbreonHeader = () => {
    const {colorScheme, toggleColorScheme} = useTheme();
    const goToLogoutRoute = useLogoutRoute();
    const {user} = useAuth();
    const height = 60;

    const darkModeToggle = colorScheme === 'dark' ? <SunIcon/> : <MoonIcon/>

    return <Header height={height} fixed>
        <Group position='apart' pr={20} pl={20} pt={5} align='center'>
            <Group>
                {user && <UmbreonAvatar/>}
            </Group>
            <Title align='center'>
                Umbreon.lol
            </Title>
            <Group position='right' spacing='md'>
                <ActionIcon size='xl' onClick={() => toggleColorScheme()}>
                    {darkModeToggle}
                </ActionIcon>
                {user && <Button variant='outline' color='red' onClick={() => goToLogoutRoute()}>
                    Logout
                </Button>}
            </Group>
        </Group>
    </Header>
}

export default UmbreonHeader;