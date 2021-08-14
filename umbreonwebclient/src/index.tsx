import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Auth0Provider} from "@auth0/auth0-react";

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

ReactDOM.render(
  <React.StrictMode>
      <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          redirectUri={window.location.origin}
      >
        <App />
      </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
