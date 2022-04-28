import {Anchor, Group, Navbar} from "@mantine/core";
import {Link} from "react-router-dom";

const UmbreonFooter = () => {
    return <Navbar width={{base:'100%'}}>
        <Group spacing='xl' position='center'>
            <Anchor component={Link} to={"/account"}>
                Account
            </Anchor>
            <Anchor component={Link} to={"/devices"}>
                Devices
            </Anchor>
            <Anchor component={Link} to={"/about"}>
                About
            </Anchor>
        </Group>
    </Navbar>
}

export default UmbreonFooter;