import './styles.css';
import React, {useCallback} from "react";
import {useAuth} from "../../../contexts/AuthContext";
import logo from "./logo.svg";

const LoginScreen = () => {
    const auth = useAuth();

    const onLogin = useCallback(() => {
        auth.login();
    }, [auth]);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <p>Git SHA: {process.env.REACT_APP_GIT_SHA}</p>

                <button onClick={onLogin}>Login</button>
            </header>
        </div>
    )
}

export default LoginScreen