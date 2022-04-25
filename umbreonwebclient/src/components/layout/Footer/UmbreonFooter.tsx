import {useAuth} from "../../../contexts/AuthContext";
import {Button, Group} from "@mantine/core";

const UmbreonFooter = () => {
    const auth = useAuth();

    return <Group position='center' align='center'>
        <Button  variant='outline' onClick={() => auth.logout()}>
            Devices
        </Button>
    </Group>
}

export default UmbreonFooter;