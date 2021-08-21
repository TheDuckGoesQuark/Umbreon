import {AppState, Auth0Provider, useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import React, {ReactNode} from "react";
import {Redirect, Route, useHistory} from "react-router-dom";
import {Loading} from "../pages/loading";

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
const auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";
const auth0RedirectUrl = process.env.REACT_APP_AUTH0_REDIRECT_URL || "";

interface ProtectedRouteProps extends React.Props<any> {
    component: React.ComponentType,

    [x: string]: any
}

export const ProtectedRoute = ({component, args}: ProtectedRouteProps) => {
    return <Route component={withAuthenticationRequired(component, {
        onRedirecting: () => <Loading/>,
    })} {...args} />
}

interface Auth0Props {
    children?: ReactNode
}

export const Auth0 = ({children}: Auth0Props) => {
   const history = useHistory();

    const onRedirectCallback = (appState: AppState) => {
        // // Use the router's history module to replace the url
        history.replace(appState?.returnTo || window.location.pathname);
    };

    return (<Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            redirectUri={`${window.location.origin}${auth0RedirectUrl}`}
            onRedirectCallback={onRedirectCallback}
            children={children}
        />
    )
}