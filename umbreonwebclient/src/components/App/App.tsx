import React from 'react';

import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from "../../contexts/AuthContext";
import AppRouter from "../Routes/AppRouter";

const App = () => {
  return (
      <BrowserRouter>
          <AuthProvider>
              <AppRouter />
          </AuthProvider>
      </BrowserRouter>
  )
};

export default App;
