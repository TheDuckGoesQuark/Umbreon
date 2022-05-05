import React from "react";
import {Outlet} from "react-router-dom";
import {AppShell} from "@mantine/core";
import UmbreonHeader from "./Header/UmbreonHeader";
import UmbreonFooter from "./Footer/UmbreonFooter";
import ErrorBoundary from "../common/ErrorBoundary";

const PageLayout: React.FC = ({children}) => {
    return (<AppShell
        fixed
        padding="md"
        header={<UmbreonHeader/>}
        footer={<UmbreonFooter/>}
    >
        <ErrorBoundary baseMessage="Something went wrong: " key='root-error-boundary'>
            <Outlet/>
            {children}
        </ErrorBoundary>
    </AppShell>)
}

export default PageLayout;
