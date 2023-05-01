import React, {PropsWithChildren, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {AppShell, Container, createStyles, MantineTheme} from "@mantine/core";
import UmbreonHeader from "./Header/UmbreonHeader";
import ErrorBoundary from "../common/ErrorBoundary";
import UmbreonNavBar from "./NavBar/UmbreonNavBar";

const PageLayout: React.FC<PropsWithChildren> = ({children}) => {
    const [navbarOpened, setNavbarOpened] = useState<boolean>(false);

    useEffect(() => {
        const closeNav = () => {
            setNavbarOpened(false);
        }
        window.addEventListener("resize", closeNav);
        return () => window.removeEventListener("resize", closeNav);
    }, [setNavbarOpened])

    return (<AppShell
        fixed
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        header={<UmbreonHeader navbarOpened={navbarOpened} setNavbarOpened={setNavbarOpened}/>}
        navbar={<UmbreonNavBar navbarOpened={navbarOpened}/>}
    >
        <ErrorBoundary baseMessage="Something went wrong: " key='root-error-boundary'>
            <Container h="100%" fluid>
                <Outlet/>
                {children}
            </Container>
        </ErrorBoundary>
    </AppShell>)
}

export default PageLayout;
