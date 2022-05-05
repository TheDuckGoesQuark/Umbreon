import {Navigate, Route, useNavigate} from "react-router-dom";
import React, {useCallback} from "react";
import PageLoader from "../layout/PageLoader/PageLoader";
import {useAuth} from "../../contexts/AuthContext";

const LoginScreen = React.lazy(() => import("../Screens/LoginScreen"));
const LogoutScreen = React.lazy(() => import("../Screens/LogoutScreen"));
const AboutScreen = React.lazy(() => import("../Screens/AboutScreen"));

export const LoginRoute = () => {
    const {isAuthenticated} = useAuth();

    const loginComponent = isAuthenticated
        ? <Navigate to={`/`} replace/>
        : <PageLoader><LoginScreen/></PageLoader>

    return <Route key='login' path='login' element={loginComponent}/>
}

export const useLoginRoute = () => {
    const navigate = useNavigate();

    return [useCallback((returnTo?: string) => {
        navigate('/login', {state: {returnTo}})
    }, [navigate]), '/login'] as const;
}

const LogoutRoute = () => {
    const logoutComponent = <PageLoader><LogoutScreen/></PageLoader>
    return <Route key='logout' path='logout' element={logoutComponent}/>;
}

export const useLogoutRoute = () => {
    const navigate = useNavigate();

    return [useCallback(() => {
        navigate('/logout')
    }, [navigate]), '/logout'] as const;
}

const AboutRoute = () => {
    const aboutComponent = <PageLoader><AboutScreen/></PageLoader>
    return <Route key='about' path='about' element={aboutComponent}/>;
}

export const useAboutRoute = () => {
    const navigate = useNavigate();

    return [useCallback(() => {
        navigate('/about')
    }, [navigate]), '/about'] as const;
}

const PublicRoutes = () => [
    LogoutRoute(),
    LoginRoute(),
    AboutRoute(),
]

export default PublicRoutes;
