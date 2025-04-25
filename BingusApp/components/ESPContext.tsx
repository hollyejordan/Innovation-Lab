import React, { createContext, Key, useContext, useEffect, useRef } from 'react'
import mitt, { Emitter, EventType, Handler } from 'mitt';

const SOCKET_URL = "ws://10.110.173.90:3068"

type Events = "transcription";
type EventHandler = (p_text: string) => void;

interface Exported
{
    register: (p_type: Events, p_handler: EventHandler) => void,
    unregister: (p_type: Events, p_handler: EventHandler) => void,
    set_recording: (p_recording: boolean) => void,
    status: () => { recording: boolean, connected: boolean }
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

// Picks a random string
const fake_text: Array<string> =
    [
        "hello how are you",
        "i just saw you",
        "how long does it take to wouble a gouble",
        "why is that the case",
        "hi",
        "what",
        "nobody cares",
        "why does university cost so much",
        "please help me",
        "daddy",
        "i live in a beautiful house",
        "with a beautiful wife",
        "i cry when angels deserve to die",
        "eating seeds as a past time activity",
        "the toxicity of this city",
        "software version seven point oh",

    ]

const ESPContext: React.FC<Props> = ({ children }) =>
{
    const webserver = useRef(new WebSocket(SOCKET_URL));
    const emitter = useRef(mitt())

    const setup_socket_events = () =>
    {
        webserver.current.onmessage = (msg: MessageEvent) =>
        {
            emitter.current.emit("transcription", JSON.parse(msg.data || "{\"text\": \"error\"}").text)
        }

        webserver.current.onclose = () =>
        {
            console.log("Lost socket connection, connecting again...");
            reconnect_socket();
        }
    }

    const reconnect_socket = () =>
    {
        // Dunno what happens if its already closed, but do this just in case its open
        webserver.current.close()
        webserver.current = new WebSocket(SOCKET_URL);
        setup_socket_events();
    }

    useEffect(() =>
    {
        setup_socket_events();

        // Sends random text to simulate connection
        const fake_info = setInterval(() =>
        {
            const text = fake_text[Math.floor(Math.random() * fake_text.length)];
            emitter.current.emit("transcription", text)
        }, 5000)

        return () =>
        {
            webserver.current.close();
            clearInterval(fake_info);
        }
    }, [])

    const set_recording = (p_recording: boolean) =>
    {
        // For now this does nothing, but thats fine
    }

    const register = (p_type: Events, p_handler: EventHandler) =>
    {
        // Very bad ts here, but I know it will be safe
        emitter.current.on(p_type, (p) => p_handler(p as string));
    }

    const unregister = (p_type: Events, p_handler: EventHandler) =>
    {
        // Very bad ts here, but I know it will be safe
        emitter.current.off(p_type, p_handler as any);
    }

    // Returns last known status
    const status = () =>
    {
        // Not implemented

        return { recording: true, connected: true }
    }

    return (
        <context.Provider value={{ register, unregister, set_recording, status }}>
            {children}
        </context.Provider>
    )
}

export default ESPContext;