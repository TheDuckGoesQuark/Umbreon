// use-api.js
import {useEffect, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {auth0Audience, auth0Scope} from "../auth0/auth0";

export interface ApiOptions extends RequestInit {
}

export interface ApiCallState  {
    loading: boolean,
    data?: string | null,
    error?: string | null,
}

export const useApi = (url: string, options?: ApiOptions) => {

    const {getAccessTokenSilently} = useAuth0();

    const [apiState, setState] = useState<ApiCallState>({
        error: null,
        loading: true,
        data: null,
    });

    const [refreshIndex, setRefreshIndex] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const {...fetchOptions} = options;
                const accessToken = await getAccessTokenSilently({auth0Audience, auth0Scope});
                const res = await fetch(url, {
                    ...fetchOptions,
                    headers: {
                        ...fetchOptions.headers,
                        // Add the Authorization header to the existing headers
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setState({
                    ...apiState,
                    data: await res.json(),
                    error: null,
                    loading: false,
                });
            } catch (error) {
                setState({
                    ...apiState,
                    error,
                    loading: false,
                });
            }
        })();
    }, [refreshIndex]);

    return {
        apiState,
        refresh: () => setRefreshIndex(refreshIndex + 1),
    };
};