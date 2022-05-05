import {Step, Stepper} from "@mantine/core";
import React from "react";
import {useMediaQuery} from "@mantine/hooks";
import {useTheme} from "../../../contexts/ThemeContext";

interface StepIndicatorProps {
    stepLabels: string[]
    activeStep: number,
}

const StepIndicator = ({stepLabels, activeStep}: StepIndicatorProps) => {
    const theme = useTheme();
    const largeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);

    const steps = stepLabels.map((label) =>
        <Step label={largeScreen ? label : undefined}/>
    )

    return <Stepper active={activeStep}>
        {steps}
    </Stepper>
}

export default StepIndicator;