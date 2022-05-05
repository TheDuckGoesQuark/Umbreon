import {useReducer} from "react";

export enum RetryableOperationStatus {
    IDLE,
    PERFORMING,
    COMPLETE,
    ERROR,
}

export enum RetryableOperationActionType {
    PERFORM,
    COMPLETED,
    ERRORED,
    RETRY,
    RESET,
}

export interface IdleState {
    state: RetryableOperationStatus.IDLE;
}

export interface InProgressState<P> {
    state: RetryableOperationStatus.PERFORMING;
    parameters: P
}

export interface CompleteState<P, R> {
    state: RetryableOperationStatus.COMPLETE;
    parameters: P;
    result: R;
}

export interface ErrorState<P, E> {
    state: RetryableOperationStatus.ERROR;
    parameters: P;
    error: E;
}

export type RetryableOperationState<P, R, E> =
    | IdleState
    | InProgressState<P>
    | CompleteState<P, R>
    | ErrorState<P, E>;

type RetryableOperationAction<P, R, E> =
    | { type: RetryableOperationActionType.PERFORM; parameters: P }
    | { type: RetryableOperationActionType.COMPLETED; parameters: P; result: R }
    | { type: RetryableOperationActionType.ERRORED; parameters: P; error: E }
    | { type: RetryableOperationActionType.RETRY; parameters: P }
    | { type: RetryableOperationActionType.RESET; };


type RetryableOperationReducerType<P, R, E> = (
    state: RetryableOperationState<P, R, E>,
    action: RetryableOperationAction<P, R, E>,
) => RetryableOperationState<P, R, E>;


const useRetryableOperationReducer = <P, R, E>() => {
    const retryableOperationReducer:RetryableOperationReducerType<P, R, E> = (state, action) => {
            switch (action.type) {
                case RetryableOperationActionType.PERFORM:
                    return {
                        state: RetryableOperationStatus.PERFORMING,
                        parameters: action.parameters
                    };
                case RetryableOperationActionType.COMPLETED:
                    return {
                        state: RetryableOperationStatus.COMPLETE,
                        parameters: action.parameters,
                        result: action.result
                    };
                case RetryableOperationActionType.ERRORED:
                    return {
                        state: RetryableOperationStatus.ERROR,
                        parameters: action.parameters,
                        error: action.error
                    };
                case RetryableOperationActionType.RETRY:
                    return {
                        state: RetryableOperationStatus.PERFORMING,
                        parameters: action.parameters
                    };
                case RetryableOperationActionType.RESET:
                    return {
                        state: RetryableOperationStatus.IDLE
                    };
                default:
                    return {
                        state: RetryableOperationStatus.IDLE
                    };
            }
        };

    return useReducer(retryableOperationReducer, {state: RetryableOperationStatus.IDLE}, arg=>arg);
}

export default useRetryableOperationReducer;