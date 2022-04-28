import {ActionIcon, Avatar, Title, Button, Group, Header} from "@mantine/core";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";
import {SunIcon, MoonIcon} from "@radix-ui/react-icons";
import {useTheme} from "../../../contexts/ThemeContext";
import UmbreonAvatar from "./UmbreonAvatar";

const UmbreonHeader = () => {
    const {colorScheme, toggleColorScheme} = useTheme();
    const auth = useAuth();
    const height = 60;

    const darkModeToggle = colorScheme === 'dark' ? <SunIcon/> : <MoonIcon/>

    return <Header height={height} fixed>
        <Group position='apart' grow pr={20} pl={20} pt={5} align='center'>
            <Group>
                {auth.user && <UmbreonAvatar/>}
            </Group>
            <Title align='center'>
                Umbreon.lol
            </Title>
            <Group position='right' spacing='md'>
                <ActionIcon size='xl' onClick={() => toggleColorScheme()}>
                    {darkModeToggle}
                </ActionIcon>
                {auth.user && <Button variant='outline' color='red' onClick={() => auth.logout()}>
                    Logout
                </Button>}
            </Group>
        </Group>
    </Header>
}

export default UmbreonHeader;