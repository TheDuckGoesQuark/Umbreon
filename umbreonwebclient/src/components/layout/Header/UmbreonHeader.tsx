import {ActionIcon, Title, Group, Header, MediaQuery, Burger} from "@mantine/core";
import {useAuth} from "../../../contexts/AuthContext";
import React from "react";
import {useTheme} from "../../../contexts/ThemeContext";
import UmbreonAvatar from "./UmbreonAvatar";
import LogoutButton from "../../common/LogoutButton";
import {Moon, Sun} from "tabler-icons-react";

interface UmbreonHeaderProps {
    navbarOpened: boolean
    setNavbarOpened: (state: ((prevState: boolean) => boolean)) => void;
}

const UmbreonHeader = ({navbarOpened, setNavbarOpened}: UmbreonHeaderProps) => {
    const {colorScheme, toggleColorScheme} = useTheme();
    const {isAuthenticated} = useAuth();
    const height = 60;

    const darkModeToggle = colorScheme === 'dark' ? <Sun/> : <Moon/>

    return <Header height={height} fixed>
        <Group align='center' position='apart' grow>
            <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                <Burger
                    opened={navbarOpened}
                    onClick={() => setNavbarOpened((o) => !o)}
                    size="sm"
                />
            </MediaQuery>

            <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
                <div>
                {isAuthenticated && <UmbreonAvatar />}
                </div>
            </MediaQuery>

            <Title align='center'>
                Umbreon.lol
            </Title>

            <Group noWrap align='center' position='right'>
                <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
                    <div>
                        {isAuthenticated && <LogoutButton/>}
                    </div>
                </MediaQuery>
                <ActionIcon onClick={() => toggleColorScheme()}>
                    {darkModeToggle}
                </ActionIcon>
            </Group>
        </Group>

    </Header>
}

export default UmbreonHeader;