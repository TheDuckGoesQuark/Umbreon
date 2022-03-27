import {useAuth} from "../../contexts/AuthContext";
import './styles.css';

const LogoutFooter = () => {
    const auth = useAuth();

    return <div className='footer'>
        <button className='center' onClick={()=>auth.logout()}>
            Logout
        </button>
    </div>
}

export default LogoutFooter;