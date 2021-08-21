import {useAuth0} from "@auth0/auth0-react";
import logo from "../logo.svg";

const LoginButton = () => {
    const {loginWithRedirect} = useAuth0();
    return <button onClick={() => loginWithRedirect()}>Log In</button>
}

export const Login = () => {
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
                <LoginButton/>
            </header>
        </div>
    );
}

