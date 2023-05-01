import {ActionIcon, Avatar} from "@mantine/core";
import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";

const UmbreonAvatar = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    const onClick = useCallback(() => {
        navigate("/account")
    }, [navigate])

    return <ActionIcon
        onClick={onClick}
    >
        <Avatar
            alt='avatar'
            src={user?.picture}
            radius='lg'
            size='md'
        />
    </ActionIcon>
}

export default UmbreonAvatar;