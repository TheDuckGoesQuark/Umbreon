import {Navigate, Route, useNavigate} from "react-router-dom";
import React, {useCallback} from "react";
import PageLoader from "../layout/PageLoader/PageLoader";
import {useAuth} from "../../contexts/AuthContext";

const LoginScreen = React.lazy(() => import("../Screens/LoginScreen"));
const LogoutScreen = React.lazy(() => import("../Screens/LogoutScreen"));

export const LoginRoute = () => {
    const {isAuthenticated} = useAuth();

    const loginComponent = isAuthenticated
        ? <Navigate to={`/`} replace/>
        : <PageLoader><LoginScreen/></PageLoader>

    return <Route key='login' path='login' element={loginComponent}/>
}

export const useLoginRoute = () => {
    const navigate = useNavigate();

    return useCallback((returnTo?: string) => {
        navigate('/login', {state: {returnTo}})
    }, [navigate])
}

const LogoutRoute = () => {
    const logoutComponent = <PageLoader><LogoutScreen/></PageLoader>
    return <Route key='logout' path='logout' element={logoutComponent}/>;
}

export const useLogoutRoute = () => {
    const navigate = useNavigate();

    return useCallback(() => {
        navigate('/logout')
    }, [navigate])
}

const PublicRoutes = () => [
    LogoutRoute(),
    LoginRoute(),
]

export default PublicRoutes;
