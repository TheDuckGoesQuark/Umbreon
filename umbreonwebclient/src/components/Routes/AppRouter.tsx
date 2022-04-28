import {Navigate, Route, Routes} from "react-router-dom";
import React from "react";
import {useAuth} from "../../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import PageLoader from "../layout/PageLoader/PageLoader";
import PageLayout from "../layout/PageLayout/PageLayout";

const LoginScreen = React.lazy(() => import("./LoginScreen"));
const UserScreen = React.lazy(() => import("./UserScreen"));
const ListDevicesScreen = React.lazy(() => import("./ListDevicesScreen"));
const ManageDeviceScreen = React.lazy(() => import("./DeviceSettings"));
const ControlDeviceScreen = React.lazy(() => import("./ControlDevice"));

const AppRouter = () => {
    const {isLoading, isAuthenticated} = useAuth();

    if (isLoading) return <PageLoader />

    const loginComponent = isAuthenticated
        ? <Navigate to={`/`} replace/>
        : <PageLoader><LoginScreen/></PageLoader>

    const userManagement = <PrivateRoute children={<PageLoader><UserScreen/></PageLoader>}/>
    const deviceList = <PrivateRoute children={<PageLoader><ListDevicesScreen/></PageLoader>}/>
    const manageDevice = <PrivateRoute children={<PageLoader><ManageDeviceScreen/></PageLoader>}/>
    const controlDevice = <PrivateRoute children={<PageLoader><ControlDeviceScreen/></PageLoader>}/>

    const rootIndexComponent = isAuthenticated
        ? <Navigate to={`/devices`} replace/>
        : <Navigate to={`/login`} replace/>;

    return (<Routes>
        <Route index element={rootIndexComponent}/>
        <Route path='logout' element={rootIndexComponent}/>
        <Route path='login' element={loginComponent}/>
        <Route path='account' element={<PageLayout/>}>
            <Route index element={userManagement}/>
        </Route>
        <Route path='devices' element={<PageLayout/>}>
            <Route index element={deviceList}/>
            <Route path=':deviceId'>
                <Route index element={manageDevice}/>
                <Route path='manage' element={manageDevice}/>
                <Route path='cockpit' element={controlDevice}/>
            </Route>
        </Route>
    </Routes>)
};

export default AppRouter;