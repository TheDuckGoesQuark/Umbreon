import {Navigate, Route, Routes} from "react-router-dom";
import React from "react";
import {useAuth} from "../../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import PageLoader from "../layout/PageLoader/PageLoader";
import AuthPageLayout from "../layout/PageLayout/AuthPageLayout";

const LoginScreen = React.lazy(() => import("./LoginScreen"));
const UserScreen = React.lazy(() => import("./UserScreen"));
const ListDevicesScreen = React.lazy(() => import("./ListDevicesScreen"));
const ManageDeviceScreen = React.lazy(() => import("./ManageDevice"));

const AppRouter = () => {
    const {isLoading, isAuthenticated} = useAuth();

    if (isLoading) return <PageLoader />

    const loginComponent = isAuthenticated
        ? <Navigate to={`/`} replace/>
        : <PageLoader><LoginScreen/></PageLoader>

    const userManagement = <PrivateRoute children={<PageLoader><UserScreen /></PageLoader>}/>
    const deviceList = <PrivateRoute children={<PageLoader><ListDevicesScreen/></PageLoader>}/>
    const manageDevice = <PrivateRoute children={<PageLoader><ManageDeviceScreen/></PageLoader>}/>

    const rootIndexComponent = isAuthenticated
        ? <Navigate to={`/devices`} replace/>
        : <Navigate to={`/login`} replace/>;

    return (<Routes>
        <Route index element={rootIndexComponent}/>
        <Route path='logout' element={rootIndexComponent}/>
        <Route path='login' element={loginComponent}/>
        <Route path='account' element={<AuthPageLayout/>}>
            <Route index element={userManagement}/>
        </Route>
        <Route path='devices' element={<AuthPageLayout/>}>
            <Route index element={deviceList}/>
            <Route path=':deviceid' element={manageDevice}/>
        </Route>
    </Routes>)
};

export default AppRouter;