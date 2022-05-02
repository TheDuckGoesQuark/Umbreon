import {Route, useNavigate} from "react-router-dom";
import PageLayout from "../layout/PageLayout";
import React, {useCallback} from "react";
import PrivateRoute from "./PrivateRoute";
import PageLoader from "../layout/PageLoader/PageLoader";

const UserScreen = React.lazy(() => import("../Screens/UserScreen"));

const AccountRoutes = () => {
    const userManagement = <PrivateRoute children={<PageLoader><UserScreen/></PageLoader>}/>
    return <Route path='account' element={<PageLayout/>}>
        <Route index element={userManagement}/>
    </Route>
}

export const useManageAccountRoute = () => {
    const navigate = useNavigate();

    return [useCallback(() => {
        navigate('/account')
    }, [navigate]), '/account'] as const;
}

export default AccountRoutes;