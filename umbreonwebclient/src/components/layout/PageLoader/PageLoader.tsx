import React from 'react';
import {LoadingOverlay} from "@mantine/core";

const PageLoader:React.FC = ({children}) => {
    if (children) {
        return <React.Suspense fallback={<LoadingOverlay visible />}>{children}</React.Suspense>
    } else {
        return <LoadingOverlay visible />
    }
}

export default PageLoader;