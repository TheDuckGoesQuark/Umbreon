import React from "react";
import {Outlet} from "react-router-dom";
import {AppShell, Center, Container} from "@mantine/core";
import UmbreonHeader from "./Header/UmbreonHeader";
import UmbreonFooter from "./Footer/UmbreonFooter";

const PageLayout: React.FC = ({children}) => {
    return (<AppShell
        fixed
        padding="md"
        header={<UmbreonHeader/>}
        footer={<UmbreonFooter/>}
    >
        <Outlet/>
        {children}
    </AppShell>)
}

export default PageLayout;
