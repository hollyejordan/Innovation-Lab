import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import mitt from 'mitt'; // Event emitter to simulate event-based ESP communication

const SOCKET_URL = "ws://10.226.79.90:3068"; // Replace with actual ESP32 WebSocket server when live

// Define allowed event types
type Events = "transcription";
type EventHandler = (p_text: string) => void;

// Shape of the exported context
interface Exported
{
    register: (p_type: Events, p_handler: EventHandler) => void,
    unregister: (p_type: Events, p_handler: EventHandler) => void,
    set_recording: (p_recording: boolean) => void,
    status: () => { recording: boolean, connected: boolean },
    set_time_per_char: (p_ms: number) => void
}

// Create the context
const context = createContext<Exported | null>(null);

// Hook to consume the ESP context
export const useESP = () =>
{
    const c = useContext(context);
    if (!c) throw new Error("ESP context used incorrectly");
    return c;
};

interface Props
{
    children: React.ReactNode;
}

// Array of fake transcription text used for local development/testing
const fake_text: string[] = [
    "hello how are you", "i just saw you", "how long does it take to wouble a gouble",
    "why is that the case", "hi", "what", "nobody cares", "why does university cost so much",
    "please help me", "daddy", "i live in a beautiful house", "with a beautiful wife",
    "i cry when angels deserve to die", "eating seeds as a past time activity",
    "the toxicity of this city", "software version seven point oh"
];

const ESPContext: React.FC<Props> = ({ children }) =>
{
    const webserver = useRef(new WebSocket(SOCKET_URL)); // WebSocket connection
    const emitter = useRef(mitt()); // Event emitter instance
    const recordingRef = useRef(false); // Live recording state for simulation
    const [recording, setRecording] = useState(false); // State used by status()

    // Setup WebSocket listeners
    const setup_socket_events = () =>
    {
        webserver.current.onmessage = (msg: MessageEvent) =>
        {
            // Parse received message and emit "transcription" event
            emitter.current.emit("transcription", JSON.parse(msg.data || "{\"text\": \"error\"}").text);
        };

        webserver.current.onerror = console.log

        webserver.current.onclose = () =>
        {
            reconnect_socket(); // Try reconnecting if connection drops
        };
    };

    // Reconnect WebSocket logic
    const reconnect_socket = () =>
    {
        webserver.current.close();
        webserver.current = new WebSocket(SOCKET_URL);
        setup_socket_events();
    };

    // On mount, connect to WebSocket and simulate fake messages every 5s (DEV mode)
    useEffect(() =>
    {
        setup_socket_events();

        const interval = setInterval(() =>
        {
            if (recordingRef.current)
            {
                const text = fake_text[Math.floor(Math.random() * fake_text.length)];
                emitter.current.emit("transcription", text); // Simulate ESP32 emitting
            }
        }, 5000000000);

        return () =>
        {
            webserver.current.close(); // Cleanup on unmount
            clearInterval(interval);
        };
    }, []);

    // Toggle the recording state
    const set_recording = (p_recording: boolean) =>
    {
        setRecording(p_recording);
        recordingRef.current = p_recording;
    };

    // Allow components to subscribe to transcription events
    const register = (p_type: Events, p_handler: EventHandler) =>
    {
        emitter.current.on(p_type, (p) => p_handler(p as string));
    };

    // Unsubscribe from transcription events
    const unregister = (p_type: Events, p_handler: EventHandler) =>
    {
        emitter.current.off(p_type, p_handler as any);
    };

    const set_time_per_char = (p_ms: number) =>
    {
        webserver.current.send(JSON.stringify({ type: 1, setting_id: 1, new_value: p_ms }))
    }

    // Return current state (used optionally)
    const status = () =>
    {
        return { recording, connected: true };
    };

    return (
        <context.Provider value={{ register, unregister, set_recording, status, set_time_per_char }}>
            {children}
        </context.Provider>
    );
};

export default ESPContext;
