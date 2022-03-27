import React, {useCallback} from "react";
import {AppState, Auth0Provider, useAuth0} from "@auth0/auth0-react";
import UmbreonUser from "../models/UmbreonUser";
import {useNavigate} from "react-router-dom";

export interface AuthContextType {
    user?: UmbreonUser;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    login: (redirectURI?: string) => void;
    logout: (returnToURL?: string) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const Auth0ConsumingAuthProvider: React.FC = ({children}) => {
    const auth = useAuth0<UmbreonUser>();

    const login = async (redirectURI?: string) => {
        await auth.loginWithRedirect({
            appState: {returnTo: redirectURI},
            redirectUri: `${window.location.origin}/login`
        })
    };

    const logout = async (returnToUrl?: string) => {
        await auth.logout({
            returnTo: returnToUrl,
        });
    };

    const value = {
        user: auth.user,
        isLoading: auth.isLoading,
        isAuthenticated: auth.isAuthenticated,
        login,
        logout
    };

    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>)
}

const Auth0ProviderWithRedirect: React.FC = ({children}) => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

    const navigate = useNavigate();

    const onRedirectCallback = useCallback((appState: AppState) => {
        navigate(appState?.returnTo || window.location.pathname);
    }, [navigate]);

    return (<Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
        useRefreshTokens={true}
        cacheLocation="localstorage"
    >
        {children}
    </Auth0Provider>)
}

const AuthProvider: React.FC = ({children}) => {
    return (<Auth0ProviderWithRedirect>
        <Auth0ConsumingAuthProvider>
            {children}
        </Auth0ConsumingAuthProvider>
    </Auth0ProviderWithRedirect>)
}

const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error(
            "useAuth must be used within a AuthProvider"
        );
    }
    return context;
}

export {AuthProvider, useAuth}