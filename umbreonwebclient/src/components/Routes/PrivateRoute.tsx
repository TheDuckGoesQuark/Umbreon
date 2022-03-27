import React from "react";
import {useAuth} from "../../contexts/AuthContext";
import {useLocation} from "react-router-dom";

interface PrivateRouteProps {
    children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const {login, isAuthenticated} = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        login(location.pathname)
    }

    return <>{children}</>;
};

export default PrivateRoute;