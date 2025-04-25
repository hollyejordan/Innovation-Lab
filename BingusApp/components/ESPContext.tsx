import React, { createContext, useContext, useEffect, useRef } from 'react'
import { SocketPersistent } from './SocketPersistent';
import { LogType } from './util';
import mitt from 'mitt';

const WEBSERVER_URL = "wss://visualeyes-relay-xxbi8.ondigitalocean.app/";

interface Exported
{
    send: (p_data: string) => void,
    on_message: (p_handler: (p_msg: string) => void) => void
}

const context = createContext<Exported | null>(null);

export const useESP = () =>
{
    const c = useContext(context);

    if (!c) throw new Error("ESP context used incorrectly")

    return c;
}

interface Props
{
    children: React.ReactNode
}

const ESPContext: React.FC<Props> = ({ children }) =>
{
    const webserver = useRef(new WebSocket("ws://10.110.173.90:3068"));
    const on_msg_handler = useRef<(p_msg: string) => void>();
    const emitter = useRef(mitt())

    useEffect(() =>
    {
        webserver.current.onmessage = (msg: MessageEvent) =>
        {
            console.log("GOT MSG");
            const event = new CustomEvent<{ text: string }>("transcription", JSON.parse(msg.data));

            emitter.current.emit(event);
        }

        webserver.current.onclose = () =>
        {
            console.log("Lost socket connection, connecting again...");
            webserver.current = new WebSocket("ws://10.110.173.90:3068");
        }
    }, [])

    const send = (p_msg: string) =>
    {
        //esp.current.send(p_msg);
        webserver.current.send(p_msg);
    }

    const on_message = (p_handler: (p_msg: string) => void) =>
    {

        on_msg_handler.current = p_handler;
    }

    return (
        <context.Provider value={{ send, on_message }}>
            {children}
        </context.Provider>
    )
}

export default ESPContext;