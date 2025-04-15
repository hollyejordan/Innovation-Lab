import { RawData, WebSocket, ClientOptions } from "ws";
import { LogType } from "./util";

const RECONNECT_INTERVAL = 10000;

export class SocketPersistent
{
    // ! means it will exist after construction
    private socket!: WebSocket;
    private url: string;
    private ready: boolean;
    private options?: ClientOptions;
    private log_mode: number;
    private on_message: (_: RawData) => void;

    // I like to be able to await the ready/fail
    private ready_promise: Promise<void>;
    // This is used, not detected though
    private resolve_ready_promise!: () => void;

    constructor (p_url: string, p_options?: ClientOptions, p_log_mode: number = LogType.INCOMING | LogType.OUTGOING | LogType.INFO | LogType.ERROR)
    {
        this.ready = false;
        this.url = p_url;
        this.options = p_options;
        this.log_mode = p_log_mode;

        // Create the promise, and set the resolve func
        this.ready_promise = new Promise((res, rej) => { this.resolve_ready_promise = res; });

        this.on_message = () => {};
        this.connect();
    }

    // Log helper
    log = (p_msg: string, p_type: LogType = LogType.INFO) =>
    {
        // Only log if it is this mode
        if (this.log_mode & p_type)
        {
            p_type === LogType.ERROR ? console.error(p_msg) : console.log(p_msg);
        }
    };

    connect = () =>
    {
        this.log(`[${this.url}] Connecting...`);

        // Connect
        this.socket = new WebSocket(this.url, this.options);

        // Set events
        this.socket.on("open", () =>
        {
            this.ready = true;

            // Resolve connection promise
            this.resolve_ready_promise();

            this.log(`[${this.url}] Connected`);
        });

        // Reconnect on close
        this.socket.on("close", () =>
        {
            this.log(`[${this.url}] Disconnected`);
            this.ready = false;
            setTimeout(this.connect, RECONNECT_INTERVAL);
        });

        // Log errors
        this.socket.on("error", (e: Error) =>
        {
            // I hard coded this for now
            this.log(`[${this.url}] Error: Connection refused`, LogType.ERROR);
        });

        // Register handler
        this.socket.on("message", (p_msg: RawData) =>
        {
            const log = Buffer.isBuffer(p_msg) ? `${p_msg.length} bytes` : p_msg.toString();

            // Logging
            this.log(`[<- ${this.url}]: ${log}`, LogType.INCOMING);
            this.on_message(p_msg);
        });
    };

    // Set handler for messages
    public on_message_received = (p_handler: (p_msg: RawData) => void) =>
    {
        this.on_message = p_handler;
    };

    // Sends data. If no connection is open it will be discarded. Queue is not req right now
    public send = (p_msg: Buffer | string) =>
    {
        if (this.ready)
        {
            this.socket.send(p_msg);

            // Logging
            const log_msg = Buffer.isBuffer(p_msg) ? `${p_msg.length} bytes` : p_msg;
            this.log(`[${this.url} <-]: ${log_msg}`, LogType.OUTGOING);
        }
    };

    // This will not timeout, and will wait forever until a connection
    public wait_ready = async (): Promise<void> =>
    {
        // Can immediately return if ready
        return this.ready_promise;
    };
}