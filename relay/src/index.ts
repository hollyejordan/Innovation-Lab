import { SocketServer } from "./SocketServer"
import { LogType } from "./util"
import { Deepgram } from "./Deepgram"
import { Encoding } from "./deepgram_def";
import { SocketPersistent } from "./SocketPersistent";
import express from "express"

// For health checks
const e = express();
e.listen(8080, () => { });

// ESP Connects to this directly
// transcription text should be sent to this in the correct esp format
// This is where audio COMES FROM
const server = new SocketServer(3067, LogType.INFO | LogType.ERROR);

// The app connects to this
// messages from this socket get sent into the server socket
// deepgram sends into this
const relay = new SocketServer(3068, LogType.INFO | LogType.INCOMING | LogType.OUTGOING | LogType.ERROR);

const deepgram = new Deepgram(Encoding.PCM, 15000);

server.on_message((m) => 
{
    if (Buffer.isBuffer(m))
    {
        deepgram.transcribe(m);

    }
})

deepgram.on_receive_text(m =>
{
    console.log(m)
    server.send(JSON.stringify({ text: m.text, diarized: 0, type: 0 }));
    relay.send(JSON.stringify({ text: m.text, diarized: 0, type: 0 }));
})

relay.on_message(msg =>
{
    server.send(msg.toString());
})