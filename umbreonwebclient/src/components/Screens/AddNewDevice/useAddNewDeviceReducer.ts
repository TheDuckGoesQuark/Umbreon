import {useReducer} from 'react'

export enum AddDeviceState {
    START,
    NEW_DEVICE_SETUP,
    EXISTING_DEVICE_SETUP,
    START_NEW_DEVICE,
    START_EXISTING_DEVICE,
    SUCCESS,
}

export enum AddDeviceAction {
    IS_NEW_DEVICE,
    IS_EXISTING_DEVICE,
    IS_ADDED,
    GO_BACK,
    IS_CONNECTED_SUCCESSFULLY,
}

type AddNewDeviceReducer = (
    state: AddDeviceState,
    action: AddDeviceAction,
) => AddDeviceState;

const addNewDeviceReducer: AddNewDeviceReducer = (state: AddDeviceState, action: AddDeviceAction) => {
    switch (action) {
        case AddDeviceAction.IS_NEW_DEVICE:
            // Show new device setup
            return AddDeviceState.NEW_DEVICE_SETUP;
        case AddDeviceAction.IS_EXISTING_DEVICE:
            // Show existing device step
            return AddDeviceState.EXISTING_DEVICE_SETUP;
        case AddDeviceAction.IS_ADDED:
            // Device is configured and added to user
            // Try start device and connect
            if (state === AddDeviceState.EXISTING_DEVICE_SETUP) {
                return AddDeviceState.START_EXISTING_DEVICE;
            } else if (state === AddDeviceState.NEW_DEVICE_SETUP) {
                return AddDeviceState.START_NEW_DEVICE;
            }
            break;
        case AddDeviceAction.GO_BACK:
            switch (state) {
                case AddDeviceState.NEW_DEVICE_SETUP:
                    // User picked wrong option
                    return AddDeviceState.START;
                case AddDeviceState.EXISTING_DEVICE_SETUP:
                    // User picked wrong option
                    return AddDeviceState.START;
                case AddDeviceState.START_NEW_DEVICE:
                    // User wasn't able to connect
                    return AddDeviceState.NEW_DEVICE_SETUP;
                case AddDeviceState.START_EXISTING_DEVICE:
                    // User wasn't able to connect
                    return AddDeviceState.EXISTING_DEVICE_SETUP;
            }
            break;
        case AddDeviceAction.IS_CONNECTED_SUCCESSFULLY:
            return AddDeviceState.SUCCESS;
    }
    return state;
};

const useAddNewDeviceReducer = () => {
    return useReducer(addNewDeviceReducer, AddDeviceState.START);
}

export default useAddNewDeviceReducer;