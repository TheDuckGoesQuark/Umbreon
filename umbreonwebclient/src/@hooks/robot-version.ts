import {useApi} from "./use-api";

export const useRobotVersion = () => {
    const url = `${window.location.origin}/bot/version`

    const {apiState, refresh} = useApi(url);

    return {
        apiState,
        refresh
    };
};