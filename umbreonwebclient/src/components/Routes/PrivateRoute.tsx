import React, {useEffect} from "react";
import {useAuth} from "../../contexts/AuthContext";
import {useLocation} from "react-router-dom";
import {useLoginRoute} from "./PublicRoutes";

interface PrivateRouteProps {
    children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const {isAuthenticated} = useAuth();
    const [goToLogin] = useLoginRoute();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            goToLogin(location.pathname);
        }
    }, [isAuthenticated, goToLogin, location])


    return <>{children}</>;
};

export default PrivateRoute;