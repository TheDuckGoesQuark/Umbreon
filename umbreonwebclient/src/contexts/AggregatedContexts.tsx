import React from "react";
import {AuthProvider} from "./AuthContext";
import {ThemeProvider} from "./ThemeContext";

const BuildProviderTree: (providers: React.FC[]) => (React.FunctionComponent) = (providers:React.FC[]) => {
    if (providers.length === 1) {
        return providers[0];
    }
    const A = providers.shift()!;
    const B = providers.shift()!;
    return BuildProviderTree([
        ({ children }) => (
            <A>
                <B>
                    {children}
                </B>
            </A>
        ),
        ...providers,
    ]);
};

const AggregatedContextsProvider : React.FC = ({children}) => {
    const Providers = BuildProviderTree([
        AuthProvider,
        ThemeProvider,
    ])
    return <Providers>
        {children}
    </Providers>
}

export {AggregatedContextsProvider}
