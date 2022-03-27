import NavHeader from "../NavHeader/NavHeader";
import LogoutFooter from "../LogoutFooter/LogoutFooter";
import React from "react";
import {Outlet} from "react-router-dom";
import './styles.css'

const AuthPageLayout:React.FC = () => {
    return <div className='pagelayout'>
        <NavHeader />
        <main className='pagebody'>
            <Outlet />
        </main>
        <LogoutFooter/>
    </div>
}

export default AuthPageLayout;
