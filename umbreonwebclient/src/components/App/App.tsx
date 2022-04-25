import React from 'react';

import {BrowserRouter} from 'react-router-dom';
import AppRouter from "../Routes/AppRouter";
import {AggregatedContextsProvider} from "../../contexts/AggregatedContexts";

const App = () => {
    return (
        <BrowserRouter>
            <AggregatedContextsProvider>
                <AppRouter/>
            </AggregatedContextsProvider>
        </BrowserRouter>
    )
};

export default App;
