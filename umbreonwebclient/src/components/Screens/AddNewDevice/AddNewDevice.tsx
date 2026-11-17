import React, {useCallback, useState} from 'react';

import {Button, Center, Container, Space, Stack} from "@mantine/core";
import useAddNewDeviceReducer, {AddDeviceAction, AddDeviceState} from "./useAddNewDeviceReducer";
import StartStep from './steps/StartStep';
import StepTransition from "./StepTransition";
import useStepTransitions from "./useStepTransitions";
import NewDeviceSetupStep from "./steps/NewDeviceSetupStep";
import ConnectingDeviceStep from "./steps/ConnectingDeviceStep";
import SuccessStep from "./steps/SuccessStep";
import ExistingDeviceSetupStep from "./steps/ExistingDeviceSetupStep";
import StepIndicator from "./StepIndicator";
import {CreatedDevice} from "../../../device/protocol";

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
    const [createdDevice, setCreatedDevice] = useState<CreatedDevice>();

    const changeStep = useCallback((action: AddDeviceAction) => {
        dispatch(action);
        startTransition();
    }, [dispatch, startTransition]);

    const showGoBackButton = state !== AddDeviceState.START;

    return <Stack align='center' justify='space-between' h="100%">
        <Center style={{flexGrow: 1}} w="100%">
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
                <NewDeviceSetupStep dispatch={changeStep} createdDevice={createdDevice} onCreated={setCreatedDevice}/>
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
                <ConnectingDeviceStep
                    deviceId={createdDevice?.device.id}
                    isActive={state === AddDeviceState.START_NEW_DEVICE}
                    nextStepDispatch={changeStep}
                />
            </StepTransition>
            <StepTransition
                activeStep={state === AddDeviceState.SUCCESS}
                onExited={endTransition}
                isTransitioning={isTransitioning}
            >
                {state === AddDeviceState.SUCCESS && createdDevice &&
                    <SuccessStep deviceId={createdDevice.device.id}/>}
            </StepTransition>
        </Center>
        <Container mt='md'>
            <Center>
                {showGoBackButton
                    ? <Button m='md' variant='outline' onClick={() => changeStep(AddDeviceAction.GO_BACK)}>Go
                        Back
                    </Button>
                    : <Space m='md'/>
                }
            </Center>
            <StepIndicator
                stepLabels={['Start', 'Setup', 'Connect']}
                activeStep={stateToStepNumber(state)}
            />
        </Container>
    </Stack>
};

export default AddNewDevice;
