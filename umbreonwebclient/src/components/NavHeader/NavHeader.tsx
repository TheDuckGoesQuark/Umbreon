import {useAuth} from "../../contexts/AuthContext";
import './styles.css';
import {Link} from "react-router-dom";

const NavHeader = () => {
    const auth = useAuth();

    return <div className='navheader'>
        <nav className='navtabs'>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to={`/users/${auth.user?.name}/repos`}>Repositories</Link>
                </li>
                <li>
                    <Link to={`/users/${auth.user?.name}`} >{auth.user?.name}</Link>
                </li>
            </ul>
        </nav>

        <div className='profile-icon'>
            <h1 className='name'>{auth.user?.name}</h1>
            <img className='avatar' alt='avatar' src={auth.user?.picture}/>
        </div>

        <hr/>
    </div>
}

export default NavHeader;