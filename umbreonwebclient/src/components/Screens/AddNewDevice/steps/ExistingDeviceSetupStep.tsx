import {Button, Group, TextInput} from "@mantine/core";
import {AddDeviceAction} from '../useAddNewDeviceReducer'
import useRetryableOperationReducer, {
    RetryableOperationActionType,
    RetryableOperationStatus
} from "../../../common/useRetryableOperationReducer";
import {ChangeEvent, useCallback, useEffect, useState} from "react";

interface ExistingDeviceSetupStepProps {
    nextStepDispatch: (action: AddDeviceAction) => void
}

const ExistingDeviceSetupStep = ({nextStepDispatch}: ExistingDeviceSetupStepProps) => {
    const [addDeviceToAccountState, dispatchAddDeviceToAccount] = useRetryableOperationReducer<void, void, void>();
    const [value, setValue] = useState<string>("")

    const onInputChange = useCallback((event:ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        if (addDeviceToAccountState.state === RetryableOperationStatus.ERROR) {
            dispatchAddDeviceToAccount({type: RetryableOperationActionType.RESET})
        }
    }, [setValue, addDeviceToAccountState.state, dispatchAddDeviceToAccount])

    const onClick = useCallback(() => {
        const shouldError = value === 'error'
        switch (addDeviceToAccountState.state) {
            case RetryableOperationStatus.ERROR:
                dispatchAddDeviceToAccount({
                    type: RetryableOperationActionType.RETRY,
                    parameters: addDeviceToAccountState.parameters
                })
                break;
            case RetryableOperationStatus.IDLE:
                dispatchAddDeviceToAccount({type: RetryableOperationActionType.PERFORM, parameters: undefined})
                break;
            default:
                break;
        }

        if (shouldError) {
            setTimeout(() => {
                dispatchAddDeviceToAccount({
                    type: RetryableOperationActionType.ERRORED,
                    parameters: undefined,
                    error: undefined
                });
            }, 1000)
        } else {
            setTimeout(() => {
                dispatchAddDeviceToAccount({
                    type: RetryableOperationActionType.COMPLETED,
                    parameters: undefined,
                    result: undefined
                });
            }, 1000)
        }
    }, [value, addDeviceToAccountState, dispatchAddDeviceToAccount])

    useEffect(() => {
        if (addDeviceToAccountState.state === RetryableOperationStatus.COMPLETE) {
            nextStepDispatch(AddDeviceAction.IS_CONNECTED_SUCCESSFULLY);
        }
    }, [nextStepDispatch, addDeviceToAccountState.state]);

    const isAddingToAccount = addDeviceToAccountState.state === RetryableOperationStatus.PERFORMING;
    const isError = addDeviceToAccountState.state === RetryableOperationStatus.ERROR;

    return <Group direction='column' position='center' align='center'>
        <TextInput
            label='Device Key Pair Code'
            onChange={onInputChange}
            value={value}
            error={isError && "Invalid"}
        />
        <Button
            type='submit'
            loading={isAddingToAccount}
            disabled={isAddingToAccount || isError}
            onClick={onClick}
        >
            Validate Code
        </Button>
    </Group>
}

export default ExistingDeviceSetupStep;