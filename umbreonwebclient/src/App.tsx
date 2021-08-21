import './App.css';
import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import {Login} from "./pages/login";
import React from "react";
import {Auth0, ProtectedRoute} from "./auth0/auth0";
import Profile from "./pages/profile";

function App() {
    return (
        <BrowserRouter>
            <Auth0>
                <Switch>
                    {ProtectedRoutes()}
                    {UnprotectedRoutes()}
                </Switch>
            </Auth0>
        </BrowserRouter>
    )
}

const UnprotectedRoutes = () => {
    return [
        <Route exact path="/" component={Login} />,
        <Route exact path="/logout" component={() => <Redirect to={"/"}/>}/>,
    ]
}

const ProtectedRoutes = () => {
    return [
        <ProtectedRoute exact path="/login" component={Profile}/>,
        <ProtectedRoute exact path="/profile" component={Profile}/>,
    ]
}

export default App;
