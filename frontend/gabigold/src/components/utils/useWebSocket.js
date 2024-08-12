// useWebSocket.js
import { useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

const useWebSocket = (url, onMessage) => {
    useEffect(() => {
        const rws = new ReconnectingWebSocket(url);
        rws.onmessage = (message) => {
            onMessage(JSON.parse(message.data));
        };

        return () => {
            rws.close();
        };
    }, [url, onMessage]);
};

export default useWebSocket;
