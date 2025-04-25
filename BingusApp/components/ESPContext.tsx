import React, { createContext, useContext, useEffect, useRef } from 'react'
import { SocketPersistent } from './SocketPersistent';
import { SocketServer } from './SocketServer';
import { LogType } from './util';

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
    const webserver = useRef(new SocketPersistent(WEBSERVER_URL));
    const esp = useRef(new SocketServer(3345, LogType.INFO | LogType.INCOMING | LogType.OUTGOING))
    const on_msg_handler = useRef<(p_msg: string) => void>();

    useEffect(() =>
    {
        webserver.current.on_message_received(msg =>
        {
            console.log(msg);
            const formatted =
            {
                type: 0,
                text: "bingus test",
                diarized: 1
            }

            esp.current.send(msg);
            if (on_msg_handler.current) on_msg_handler.current(msg)
        })

        esp.current.on_message((msg) =>
        {
            webserver.current.send(msg);
        })
    }, [])

    const send = (p_msg: string) =>
    {
        esp.current.send(p_msg);
    }

    const on_message = (p_handler: (p_msg: string) => void) =>
    {
        on_msg_handler.current = p_handler;
    }

    return (
        <context.Provider value={{ send, on_message }}>

        </context.Provider>
    )
}

export default ESPContext;