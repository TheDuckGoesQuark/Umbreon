import {useMemo} from "react";
import {useAuth} from "../contexts/AuthContext";
import {CreatedDevice, DeviceSummary} from "./protocol";

const useDeviceApi = () => {
    const {getAccessToken} = useAuth();

    return useMemo(() => {
        const request = async (path: string, init: RequestInit = {}) => {
            const token = await getAccessToken();
            const response = await fetch(path, {
                ...init,
                headers: {
                    ...init.headers,
                    ...(token ? {Authorization: `Bearer ${token}`} : {}),
                },
            });
            if (!response.ok) {
                throw new Error(`${init.method ?? 'GET'} ${path} failed with ${response.status}`);
            }
            return response;
        };

        return {
            listDevices: async (): Promise<DeviceSummary[]> =>
                (await request('/api/devices')).json(),
            createDevice: async (name: string): Promise<CreatedDevice> =>
                (await request('/api/devices', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name}),
                })).json(),
            deleteDevice: async (deviceId: string): Promise<void> => {
                await request(`/api/devices/${encodeURIComponent(deviceId)}`, {method: 'DELETE'});
            },
            createControlTicket: async (deviceId: string): Promise<string> => {
                const path = `/api/devices/${encodeURIComponent(deviceId)}/control-ticket`;
                return (await (await request(path, {method: 'POST'})).json()).ticket;
            },
        };
    }, [getAccessToken]);
}

export default useDeviceApi;
