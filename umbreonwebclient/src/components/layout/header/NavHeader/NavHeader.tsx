import {useAuth} from "../../../../contexts/AuthContext";
import './styles.scss';

const NavHeader = () => {
    const auth = useAuth();

    return <div className='navheader'>
        <div className="logo">
            <h1>
                Umbreon.lol
            </h1>
        </div>
        <div className='profile-icon'>
            <h2 className='name'>{auth.user?.name}</h2>
            <img className='avatar' alt='avatar' src={auth.user?.picture}/>
        </div>
    </div>
}

export default NavHeader;