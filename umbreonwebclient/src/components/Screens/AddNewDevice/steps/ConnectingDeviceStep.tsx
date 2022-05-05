import {Button, Group, Text} from "@mantine/core";
import {AddDeviceAction} from '../useAddNewDeviceReducer'
import useRetryableOperationReducer, {
    RetryableOperationActionType,
    RetryableOperationStatus
} from "../../../common/useRetryableOperationReducer";
import {useCallback, useEffect} from "react";

interface ConnectingNewDeviceStepProps {
    nextStepDispatch: (action: AddDeviceAction) => void
}

const ConnectingDeviceStep = ({nextStepDispatch}: ConnectingNewDeviceStepProps) => {
    const [connectingState, dispatchConnectingAction] = useRetryableOperationReducer<void, void, void>();

    const onClick = useCallback(() => {
        switch (connectingState.state) {
            case RetryableOperationStatus.ERROR:
                dispatchConnectingAction({type: RetryableOperationActionType.RETRY, parameters: connectingState.parameters})
                break;
            case RetryableOperationStatus.IDLE:
                dispatchConnectingAction({type: RetryableOperationActionType.PERFORM, parameters: undefined})

                // mock async
                setTimeout(()=> {
                    dispatchConnectingAction({type: RetryableOperationActionType.COMPLETED, parameters: undefined, result: undefined});
                }, 1000)
                break;
            default:
                break;
        }
    }, [connectingState, dispatchConnectingAction])

    useEffect(() => {
        if (connectingState.state === RetryableOperationStatus.COMPLETE) {
            nextStepDispatch(AddDeviceAction.IS_CONNECTED_SUCCESSFULLY);
        }
    }, [nextStepDispatch, connectingState.state]);

    const isTryingToConnect = connectingState.state === RetryableOperationStatus.PERFORMING;

    return <Group direction='column' position='center' align='center'>
        <Text>Turn on your device and wait for WAITING message</Text>
        <Button loading={isTryingToConnect} disabled={isTryingToConnect} onClick={onClick}>Try to connect</Button>
    </Group>
}

export default ConnectingDeviceStep;