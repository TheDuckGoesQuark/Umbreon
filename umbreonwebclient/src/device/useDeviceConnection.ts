import {useCallback, useEffect, useRef, useState} from "react";
import {Command, DeviceEvent, Telemetry} from "./protocol";
import useDeviceApi from "./useDeviceApi";

const RECONNECT_DELAY_MS = 2000;

export interface DeviceConnection {
    isServerConnected: boolean,
    isBotOnline: boolean,
    botVersion?: string,
    telemetry?: Telemetry,
    send: (command: Command) => void,
}

const controlSocketUrl = (deviceId: string, ticket: string) => {
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${scheme}://${window.location.host}/ws/control/${encodeURIComponent(deviceId)}?ticket=${ticket}`;
}

const useDeviceConnection = (deviceId: string): DeviceConnection => {
    const {createControlTicket} = useDeviceApi();
    const socketRef = useRef<WebSocket>();
    const [isServerConnected, setIsServerConnected] = useState(false);
    const [isBotOnline, setIsBotOnline] = useState(false);
    const [botVersion, setBotVersion] = useState<string>();
    const [telemetry, setTelemetry] = useState<Telemetry>();

    useEffect(() => {
        let reconnectTimer: number | undefined;
        let isDisposed = false;

        const retryLater = () => {
            if (!isDisposed) {
                reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
            }
        };

        const connect = async () => {
            let ticket: string;
            try {
                ticket = await createControlTicket(deviceId);
            } catch {
                retryLater();
                return;
            }
            if (isDisposed) {
                return;
            }
            const socket = new WebSocket(controlSocketUrl(deviceId, ticket));
            socketRef.current = socket;

            socket.onopen = () => setIsServerConnected(true);
            socket.onmessage = (message) => {
                const event: DeviceEvent = JSON.parse(message.data);
                switch (event.type) {
                    case 'device_status':
                        setIsBotOnline(event.online);
                        if (!event.online) {
                            setTelemetry(undefined);
                        }
                        break;
                    case 'hello':
                        setBotVersion(event.version);
                        break;
                    case 'telemetry':
                        setTelemetry(event);
                        break;
                }
            };
            socket.onclose = () => {
                setIsServerConnected(false);
                setIsBotOnline(false);
                retryLater();
            };
        };
        connect();

        return () => {
            isDisposed = true;
            window.clearTimeout(reconnectTimer);
            socketRef.current?.close();
        };
    }, [deviceId, createControlTicket]);

    const send = useCallback((command: Command) => {
        const socket = socketRef.current;
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(command));
        }
    }, []);

    return {isServerConnected, isBotOnline, botVersion, telemetry, send};
}

export default useDeviceConnection;
