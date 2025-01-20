import { IncomingMessage } from 'http';
import WebSocket, { RawData } from 'ws';
import { LogType } from './util';

const TIMEOUT = 10000;
const READY_POLL_RATE = 50;

export class SocketServer
{
    _clients: Set<WebSocket>;
    _server: WebSocket.Server;
    _ready: boolean;
    _log_mode: number;
    _on_message: (p_msg: RawData, p_client: WebSocket) => void;

    constructor(p_port: number, p_log_mode: number = 0)
    {
        this._ready = false;
        this._on_message = () => { };
        this._clients = new Set<WebSocket>();
        this._server = new WebSocket.Server({ port: p_port });
        this._log_mode = p_log_mode;

        this._server.on("listening", () =>
        {
            this._ready = true;
            this._log(`[${p_port}] Listening`, LogType.INFO);
        })

        // When a client connects, forward the events to this classes function
        this._server.on("connection", (client, request: IncomingMessage) =>
        {
            // Add to list
            this._clients.add(client);
            this._log(`[${request.socket.remoteAddress}] Client connected`, LogType.INFO);

            // Add to message event
            client.on("message", (msg) => 
            {
                const log = Buffer.isBuffer(msg) ? `${msg.length} bytes` : msg.toString();
                this._log(`[<- ${request.socket.remoteAddress}]: ${log}`, LogType.INCOMING);
                this._on_message(msg, client);
            });

            // Removed from list once closed
            client.on("close", () =>
            {
                this._clients.delete(client)
                this._log(`[${request.socket.remoteAddress}] Client disconnected`, LogType.INFO);
            });
        });

        this._server.on("close", () => this._log(`[${p_port}] Server closed`, LogType.INFO));

        this._server.on("error", (e) => this._log(`[${p_port}] Error: ${e.message}`, LogType.ERROR));
    }

    // Message event
    on_message = (p_handler: (p_msg: RawData, p_client: WebSocket) => void) =>
    {
        this._on_message = p_handler;
    }

    // Send all for ease of my life
    send = (p_msg: string) =>
    {
        const log = Buffer.isBuffer(p_msg) ? `${p_msg.length} bytes` : p_msg.toString();
        this._log(`[All (${this._clients.size}) <-]: ${log}`, LogType.OUTGOING);
        this._clients.forEach(c => c.send(p_msg));
    }

    // Helper func wrapping ready in await + timeout
    ready = async (): Promise<void> =>
    {
        // Can immediatelt return if ready
        if (this._ready) return;

        return new Promise((res, rej) =>
        {
            let interval: NodeJS.Timeout;
            let timeout: NodeJS.Timeout;

            // Check state every x ms
            interval = setInterval(() =>
            {
                if (this._ready)
                {
                    res();
                    if (interval) clearInterval(interval);
                    if (timeout) clearTimeout(timeout);
                }
            }, READY_POLL_RATE);

            // Reject after x ms
            timeout = setTimeout(() =>
            {
                if (interval) clearInterval(interval);
                if (timeout) clearTimeout(timeout);
                throw new Error("Timed out");
            }, TIMEOUT);
        })
    }

    _log = (p_msg: string, p_type: LogType = LogType.INFO) =>
    {
        // Only log if it is this mode
        if (this._log_mode & p_type)
        {
            p_type === LogType.ERROR ? console.error(p_msg) : console.log(p_msg);
        }
    }
}