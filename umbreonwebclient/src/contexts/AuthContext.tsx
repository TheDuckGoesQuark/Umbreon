import React, {PropsWithChildren, useCallback, useMemo, useState} from "react";
import {AppState, Auth0Provider, useAuth0, User} from "@auth0/auth0-react";
import UmbreonUser from "../models/UmbreonUser";
import {useNavigate} from "react-router-dom";

export interface AuthContextType {
    user?: UmbreonUser;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    login: (redirectURI?: string) => Promise<void>;
    logout: (returnToURL?: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const OFFLINE_USER: UmbreonUser = {
    address: "221B Baker Street",
    birthdate: "17/09/1997",
    email: "jmackie97@hotmail.com",
    email_verified: true,
    family_name: "Mackie",
    gender: "Male",
    given_name: "Jordan",
    locale: "UK",
    middle_name: "",
    name: "Jordan Mackie",
    nickname: "Mackattack",
    phone_number: "+44123123123",
    phone_number_verified: true,
    picture: "offline",
    preferred_username: "LettuceSeal",
    profile: "LettuceSeal",
    updated_at: "",
    website: "",
    zoneinfo: ""
}

const getLoginUrl = () => {
    return `${window.location.origin}/login`
}

const shouldUseOfflineProvider = () => {
    return import.meta.env.VITE_OFFLINE_MODE === 'true';
}

const OfflineAuthProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [user, setUser] = useState<UmbreonUser>()
    const navigate = useNavigate();

    const login = async (redirectURI?: string) => {
        setUser(OFFLINE_USER);
        navigate(redirectURI || '/login')
    }

    const logout = async (returnToUrl?: string) => {
        setUser(undefined);
        navigate(returnToUrl || '/login')
    };

    const value = {
        user: user,
        isLoading: false,
        isAuthenticated: Boolean(user),
        login,
        logout
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

const Auth0ConsumingAuthProvider: React.FC<PropsWithChildren> = ({children}) => {
    const auth = useAuth0<UmbreonUser>();

    const login = useCallback(async (redirectURI?: string) => {
        await auth.loginWithRedirect({
            appState: {returnTo: redirectURI},
            authorizationParams: {
                redirect_uri: getLoginUrl()
            }
        })
    }, [auth]);

    const logout = useCallback(async (returnToUrl?: string) => {
        await auth.logout({
            logoutParams: {
                returnTo: returnToUrl,
            }
        });
    }, [auth]);

    const value = useMemo(() => ({
        user: auth.user,
        isLoading: auth.isLoading,
        isAuthenticated: auth.isAuthenticated,
        login,
        logout
    }), [auth, login, logout]);

    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>)
}

const Auth0ProviderWithRedirect: React.FC<PropsWithChildren> = ({children}) => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN || "";
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "";

    const navigate = useNavigate();

    const onRedirectCallback = useCallback((appState?: AppState) => {
        navigate(appState?.returnTo || window.location.pathname);
    }, [navigate]);

    return (<Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{redirect_uri: window.location.origin}}
        onRedirectCallback={onRedirectCallback}
        useRefreshTokens={true}
        cacheLocation="localstorage"
    >
        {children}
    </Auth0Provider>)
}

const AuthProvider: React.FC<PropsWithChildren> = ({children}) => {
    if (shouldUseOfflineProvider()) {
        return <OfflineAuthProvider>
            {children}
        </OfflineAuthProvider>
    } else {
        return (<Auth0ProviderWithRedirect>
            <Auth0ConsumingAuthProvider>
                {children}
            </Auth0ConsumingAuthProvider>
        </Auth0ProviderWithRedirect>)
    }
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