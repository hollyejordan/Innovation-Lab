import { LogType, SocketPersistent, SocketServer } from 'shared';

const server = new SocketServer(9067, LogType.INFO | LogType.ERROR | LogType.OUTGOING);
//const test = new SocketPersistent("ws://localhost:9067", {}, LogType.INFO | LogType.INCOMING)

server.ready().then(() =>
{
    setInterval(() =>
    {
        const msg1 =
        {
            type: 0,
            text: "bingus test",
            diarized: 1
        }

        const msg =
        {
            type: 2,
            is_recording: true
        }

        server.send(JSON.stringify(msg));
        server.send(JSON.stringify(msg1));
    }, 1000);

})