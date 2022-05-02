import {Transition} from "@mantine/core";
import React from "react";

interface StepTransitionProps {
    activeStep: boolean,
    onExited: () => void,
    isTransitioning: boolean,
}

const StepTransition: React.FC<StepTransitionProps> = ({
                                      children,
                                      activeStep,
                                      onExited,
                                      isTransitioning
                                  }) => {
    const transition = isTransitioning ? 'slide-left' : 'slide-right';

    return <Transition mounted={activeStep && !isTransitioning} transition={transition} onExited={onExited}>
        {(styles) => <div style={styles}>
            {children}
        </div>}
    </Transition>;
}

export default StepTransition;