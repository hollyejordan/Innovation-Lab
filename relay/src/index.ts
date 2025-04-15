import { SocketServer } from "./SocketServer"
import { LogType } from "./util"
import { Deepgram } from "./Deepgram"
import { Encoding } from "./deepgram_def";

const server = new SocketServer(3067, LogType.INFO);
const deepgram = new Deepgram(Encoding.PCM, 22000);

server.on_message((m) => 
{
    if (Buffer.isBuffer(m)) deepgram.transcribe(m);
})

deepgram.on_receive_text(m =>
{
    server.send(JSON.stringify({ text: m.text, diarized: 0, type: 0 }));
})