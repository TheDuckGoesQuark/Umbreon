import React from 'react';
import {useParams} from "react-router-dom";

const ControlDevice = () => {
    const {deviceId} = useParams();
    return <main>
        <p>Cockpit for device {deviceId}!</p>
    </main>
};

export default ControlDevice;
