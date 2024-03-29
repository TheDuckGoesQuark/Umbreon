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
        <Group align='center' position='apart' h="100%" px="sm" noWrap>
            <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                <Burger
                    opened={navbarOpened}
                    onClick={() => setNavbarOpened((o) => !o)}
                    size="sm"
                />
            </MediaQuery>

            <MediaQuery largerThan="sm" styles={{textAlign: 'left'}}>
                <Title align='right' style={{flexGrow: 1}}>
                    Umbreon.lol
                </Title>
            </MediaQuery>

            <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
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
            </MediaQuery>
        </Group>

    </Header>
}

export default UmbreonHeader;