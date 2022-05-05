import {Button} from "@mantine/core";
import React, {useEffect, useState} from "react";

const SelfDestructButton = () => {
    const [shouldSelfDestruct, setShouldSelfDestruct] = useState<boolean>(false);

    useEffect(() => {
        if (shouldSelfDestruct) {
            throw new Error("Something")
        }
    }, [shouldSelfDestruct])

    return <Button color='red' onClick={()=>{setShouldSelfDestruct(true)}}>Self Destruct</Button>
}

export default SelfDestructButton;