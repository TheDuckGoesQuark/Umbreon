import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {AppShell, Container, createStyles, MantineTheme} from "@mantine/core";
import UmbreonHeader from "./Header/UmbreonHeader";
import UmbreonFooter from "./Footer/UmbreonFooter";
import ErrorBoundary from "../common/ErrorBoundary";
import UmbreonNavBar from "./NavBar/UmbreonNavBar";

const useStyles = createStyles((theme: MantineTheme) => ({
    container: {
        minHeight: '100%',
    },
}));

const PageLayout: React.FC = ({children}) => {
    const {classes} = useStyles();

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
        navbarOffsetBreakpoint={1000000}
        header={<UmbreonHeader navbarOpened={navbarOpened} setNavbarOpened={setNavbarOpened}/>}
        navbar={<UmbreonNavBar navbarOpened={navbarOpened}/>}
        footer={<UmbreonFooter/>}
    >
        <ErrorBoundary baseMessage="Something went wrong: " key='root-error-boundary'>
            <Container className={classes.container} fluid>
                <Outlet/>
                {children}
            </Container>
        </ErrorBoundary>
    </AppShell>)
}

export default PageLayout;
