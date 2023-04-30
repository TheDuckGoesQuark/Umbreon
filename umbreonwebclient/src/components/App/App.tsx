import React from 'react';

import {BrowserRouter} from 'react-router-dom';
import AppRouter from "../Routes/AppRouter";
import {AggregatedContextsProvider} from "../../contexts/AggregatedContexts";
import {AuthProvider} from "../../contexts/AuthContext";
import {ThemeProvider} from "../../contexts/ThemeContext";

const PROVIDERS = [
    ThemeProvider, AuthProvider
]

const App = () => {
    return (
        <BrowserRouter>
            <AggregatedContextsProvider contextProviders={PROVIDERS}>
                <AppRouter/>
            </AggregatedContextsProvider>
        </BrowserRouter>
    )
};

export default App;
