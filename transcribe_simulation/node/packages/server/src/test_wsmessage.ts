import { LogType, SocketPersistent, SocketServer } from 'shared';

const server = new SocketServer(9067, LogType.INFO | LogType.ERROR | LogType.OUTGOING);
const test = new SocketPersistent("ws://localhost:9067", {}, LogType.INFO | LogType.INCOMING)

server.ready().then(() =>
{
    setInterval(() =>
    {
        const msg =
        {
            type: 0,
            text: "bingus test",
            diarized: 1
        }

        server.send(JSON.stringify(msg));
    }, 1000);

})