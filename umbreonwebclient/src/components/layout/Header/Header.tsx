import {Avatar, Title, Button, Group} from "@mantine/core";
import {useAuth} from "../../../contexts/AuthContext";

const UmbreonHeader = () => {
    const auth = useAuth();

    return <Group position='apart' spacing='md'>
            <Avatar alt='avatar' src={auth.user?.picture} radius='md' size='lg'/>
            <Title>
                Umbreon.lol
            </Title>
            <Button variant='outline' color='red' onClick={() => auth.logout()}>
                Logout
            </Button>
        </Group>
}

export default UmbreonHeader;