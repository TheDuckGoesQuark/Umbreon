import PrivateRoute from "./PrivateRoute";
import PageLoader from "../layout/PageLoader/PageLoader";
import {Route, useNavigate} from "react-router-dom";
import PageLayout from "../layout/PageLayout/PageLayout";
import React, {useCallback} from "react";

const ListDevicesScreen = React.lazy(() => import("../Screens/ListDevicesScreen"));
const ManageDeviceScreen = React.lazy(() => import("../Screens/DeviceSettings"));
const ControlDeviceScreen = React.lazy(() => import("../Screens/ControlDevice"));

const DevicesRoutes = () => {
    const deviceList = <PrivateRoute children={<PageLoader><ListDevicesScreen/></PageLoader>}/>
    const manageDevice = <PrivateRoute children={<PageLoader><ManageDeviceScreen/></PageLoader>}/>
    const controlDevice = <PrivateRoute children={<PageLoader><ControlDeviceScreen/></PageLoader>}/>

    return <Route path='devices' element={<PageLayout/>}>
        <Route index element={deviceList}/>
        <Route path=':deviceId'>
            <Route index element={manageDevice}/>
            <Route path='manage' element={manageDevice}/>
            <Route path='cockpit' element={controlDevice}/>
        </Route>
    </Route>
}

export const useListDevicesRoute = () => {
    const navigate = useNavigate();

    return [useCallback(() => {
        navigate('/devices')
    }, [navigate]), '/devices'] as const;
}

export const useManageDeviceRoute = (deviceId: string) => {
    const navigate = useNavigate();

    return useCallback(() => {
        navigate(`/devices/${deviceId}`)
    }, [navigate, deviceId])
}

export const useControlDeviceRoute = (deviceId: string) => {
    const navigate = useNavigate();

    return useCallback(() => {
        navigate(`/devices/${deviceId}/cockpit`)
    }, [navigate, deviceId])
}

export default DevicesRoutes;