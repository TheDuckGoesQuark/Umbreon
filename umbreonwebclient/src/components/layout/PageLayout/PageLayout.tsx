import React from "react";
import {Outlet} from "react-router-dom";
import {AppShell, Container} from "@mantine/core";
import UmbreonHeader from "../Header/UmbreonHeader";
import UmbreonFooter from "../Footer/UmbreonFooter";

const PageLayout: React.FC = () => {
    return (<AppShell
        padding="md"
        header={<UmbreonHeader/>}
        footer={<UmbreonFooter/>}
    >
        <Container mt={40} pt={10} mb={40} fluid>
            <Outlet/>
        </Container>
    </AppShell>)
}

export default PageLayout;
