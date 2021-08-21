import './App.css';
import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import {Login} from "./pages/login";
import React from "react";
import {Auth0, ProtectedRoute} from "./auth0/auth0";
import Profile from "./pages/profile";
import {useAuth0} from "@auth0/auth0-react";

function App() {
    return (
        <BrowserRouter>
            <Auth0>
                <Switch>
                    {ProtectedRoutes()}
                    {UnprotectedRoutes()}
                    <HomeRoute/>
                </Switch>
            </Auth0>
        </BrowserRouter>
    )
}

const HomeRoute = () => {
    const {isAuthenticated, isLoading} = useAuth0();

    console.log(isAuthenticated, isLoading)

    if (isLoading) {
        return <></>
    }

    return isAuthenticated
        ? <Route exact path="/" component={() => <Redirect to={"/profile"}/>}/>
        : <Route exact path="/" component={Login}/>
}

const UnprotectedRoutes = () => {
    return [
        <Route key={"/logout"} path="/logout" component={() => <Redirect to={"/"}/>}/>,
    ]
}

const ProtectedRoutes = () => {
    return [
        <ProtectedRoute key={"/login"} path="/login" component={() => <Redirect to={"/profile"}/>}/>,
        <ProtectedRoute key={"/profile"} path="/profile" component={() => <Profile/>}/>,
    ]
}

export default App;
