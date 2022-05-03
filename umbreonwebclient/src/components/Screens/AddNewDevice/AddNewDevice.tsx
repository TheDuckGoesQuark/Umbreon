import React, {useCallback} from 'react';

import {Center, Container, Stack, Step, Stepper} from "@mantine/core";
import useAddNewDeviceReducer, {AddDeviceAction, AddDeviceState} from "./useAddNewDeviceReducer";
import StartStep from './steps/StartStep';
import StepTransition from "./StepTransition";
import useStepTransitions from "./useStepTransitions";
import NewDeviceSetupStep from "./steps/NewDeviceSetup";

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

    // to add new never before seen device

    // generate new key pair from server with expiry
    // download script to be put on device that uses key pair

    // boot ev3
    // copy over script
    // follow instructions that will run script on startup

    // start device
    // try connect

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
            </Container>
            <Container mt='md'>
                <Stepper active={stateToStepNumber(state)}>
                    <Step>
                        Start
                    </Step>
                    <Step>
                        Setting up your device
                    </Step>
                    <Step>
                        Connecting device to your account
                    </Step>
                    <Step>
                        Confirm device setup was successful
                    </Step>
                    <Step>
                        Complete
                    </Step>
                </Stepper>
            </Container>
        </Stack>
    </Center>
};

export default AddNewDevice;
