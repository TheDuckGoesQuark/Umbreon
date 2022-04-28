import {Navigate, Route, Routes} from "react-router-dom";
import React from "react";
import {useAuth} from "../../contexts/AuthContext";
import PageLoader from "../layout/PageLoader/PageLoader";
import DevicesRoutes from "./DevicesRoutes";
import AccountRoutes from "./AccountRoutes";
import PublicRoutes from "./PublicRoutes";

const AppRouter = () => {
    const {isLoading, isAuthenticated} = useAuth();

    if (isLoading) return <PageLoader />

    const rootIndexComponent = isAuthenticated
        ? <Navigate to={`/devices`} replace/>
        : <Navigate to={`/login`} replace/>;

    return (<Routes>
        <Route index element={rootIndexComponent}/>
        {PublicRoutes()}
        {AccountRoutes()}
        {DevicesRoutes()}
    </Routes>)
};


export default AppRouter;