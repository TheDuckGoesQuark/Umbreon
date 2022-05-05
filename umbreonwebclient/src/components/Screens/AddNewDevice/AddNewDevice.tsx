import React, {useCallback} from 'react';

import {Button, Center, Container, Stack, Step, Stepper} from "@mantine/core";
import useAddNewDeviceReducer, {AddDeviceAction, AddDeviceState} from "./useAddNewDeviceReducer";
import StartStep from './steps/StartStep';
import StepTransition from "./StepTransition";
import useStepTransitions from "./useStepTransitions";
import NewDeviceSetupStep from "./steps/NewDeviceSetupStep";
import ConnectingDeviceStep from "./steps/ConnectingDeviceStep";
import SuccessStep from "./steps/SuccessStep";
import ExistingDeviceSetupStep from "./steps/ExistingDeviceSetupStep";

const stateToStepNumber = (state: AddDeviceState): number => {
    switch (state) {
        case AddDeviceState.START:
            return 0;
        case AddDeviceState.NEW_DEVICE_SETUP:
            return 1;
        case AddDeviceState.EXISTING_DEVICE_SETUP:
            return 1;
        case AddDeviceState.START_NEW_DEVICE:
            return 2;
        case AddDeviceState.START_EXISTING_DEVICE:
            return 2;
        case AddDeviceState.SUCCESS:
            return 3;
    }
}

const AddNewDevice = () => {
    const [state, dispatch] = useAddNewDeviceReducer();
    const [isTransitioning, startTransition, endTransition] = useStepTransitions();

    const changeStep = useCallback((action: AddDeviceAction) => {
        dispatch(action);
        startTransition();
    }, [dispatch, startTransition]);

    const showGoBackButton = state !== AddDeviceState.START;

    // to add device that's been set up before
    // ask for device key pair code

    // start device
    // try connect

    return <Center
        sx={() => ({height: '100%'})}
    >
        <Stack>
            <Container p='xl' sx={(theme) => ({
                height: '50vh',
            })}>
                <StepTransition
                    activeStep={state === AddDeviceState.START}
                    onExited={endTransition}
                    isTransitioning={isTransitioning}
                >
                    <StartStep dispatch={changeStep}/>
                </StepTransition>
                <StepTransition
                    activeStep={state === AddDeviceState.NEW_DEVICE_SETUP}
                    onExited={endTransition}
                    isTransitioning={isTransitioning}
                >
                    <NewDeviceSetupStep dispatch={changeStep}/>
                </StepTransition>
                <StepTransition
                    activeStep={state === AddDeviceState.EXISTING_DEVICE_SETUP}
                    onExited={endTransition}
                    isTransitioning={isTransitioning}
                >
                    <ExistingDeviceSetupStep nextStepDispatch={changeStep}/>
                </StepTransition>
                <StepTransition
                    activeStep={state === AddDeviceState.START_NEW_DEVICE}
                    onExited={endTransition}
                    isTransitioning={isTransitioning}
                >
                    <ConnectingDeviceStep nextStepDispatch={changeStep} />
                </StepTransition>
                <StepTransition
                    activeStep={state === AddDeviceState.SUCCESS}
                    onExited={endTransition}
                    isTransitioning={isTransitioning}
                >
                    <SuccessStep deviceId={"abc"} />
                </StepTransition>
            </Container>
            <Container mt='md'>
                <Center>
                    {showGoBackButton &&
                    <Button m='md' variant='outline' onClick={() => changeStep(AddDeviceAction.GO_BACK)}>Go Back</Button>}
                </Center>
                <Stepper active={stateToStepNumber(state)}>
                    <Step label='Start' />
                    <Step label='Setup ' />
                    <Step label='Connect' />
                </Stepper>
            </Container>
        </Stack>
    </Center>
};

export default AddNewDevice;