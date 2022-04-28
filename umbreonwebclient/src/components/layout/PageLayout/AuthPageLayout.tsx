import React from "react";
import {Outlet} from "react-router-dom";
import {AppShell, Container, Footer, Header} from "@mantine/core";
import UmbreonHeader from "../Header/Header";
import UmbreonFooter from "../Footer/UmbreonFooter";

const AuthPageLayout: React.FC = () => {
    return (<AppShell
        padding="md"
        header={<Header height={100} p='md' fixed><UmbreonHeader/></Header>}
        footer={<Footer height={100} p='md' fixed><UmbreonFooter/></Footer>}
    >
        <Container mt={100} mb={100} fluid>
            <Outlet/>
        </Container>
    </AppShell>)
}

export default AuthPageLayout;
