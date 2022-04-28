import React from "react";
import {useAuth} from "../../../contexts/AuthContext";

const Profile = () => {
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (<div>
        <img src={user?.picture} alt={user?.name}/>
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
    </div>)
};

export default Profile;