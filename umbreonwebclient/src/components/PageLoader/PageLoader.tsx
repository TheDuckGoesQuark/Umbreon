import React from 'react';
import './styles.css';

const PageLoader:React.FC = ({children}) => {
    const loader = <div className='pageloader'>
        Loading...
    </div>;

    if (children) {
        return <React.Suspense fallback={loader}>{children}</React.Suspense>
    } else {
        return loader;
    }
}

export default PageLoader;