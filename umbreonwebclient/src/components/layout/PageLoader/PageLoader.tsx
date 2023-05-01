import React, {PropsWithChildren} from 'react';
import {LoadingOverlay} from "@mantine/core";

const PageLoader:React.FC<PropsWithChildren> = ({children}) => {
    if (children) {
        return <React.Suspense fallback={<LoadingOverlay visible />}>{children}</React.Suspense>
    } else {
        return <LoadingOverlay visible />
    }
}

export default PageLoader;