import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useRobotVersion} from "../@hooks/robot-version";

const LogoutButton = () => {
    const {logout} = useAuth0();

    return <button onClick={() => logout({returnTo: `${window.location.origin}/logout`})}>Log Out</button>
}

const Profile = () => {
    const {user, isLoading} = useAuth0();
    const {apiState, refresh} = useRobotVersion()

    if (isLoading || !user) {
        return <div>Loading ...</div>;
    }

    return (<div>
            <img src={user.picture} alt={user.name}/>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>Robot Version: {apiState.loading ? "loading" : apiState.data?.toString()}</p>
            <button onClick={() => {refresh()}}>Refresh Robot Version</button>
            <LogoutButton/>
        </div>
    )
};

export default Profile;