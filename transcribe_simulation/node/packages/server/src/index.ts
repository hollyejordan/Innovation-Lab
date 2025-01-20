import { LogType, SocketPayloadType, SocketServer, SP_TranscribeResult } from 'shared';
import { Deepgram } from './Deepgram';
import { Encoding } from './deepgram_def';

const HOST_PORT = 9067;

(async () =>
{
    const deepgram = new Deepgram(Encoding.PCM, 44100);

    // This is what app connects to
    let server = new SocketServer(HOST_PORT, LogType.INFO);

    server.on_message((m) =>
    {
        if (Buffer.isBuffer(m)) deepgram.transcribe(m);
    });

    deepgram.on_receive_text((t) =>
    {
        const socket_msg: SP_TranscribeResult =
        {
            type: SocketPayloadType.TRANSCRIBE_RESULT,
            text: t.text,
            diarized: t.diarized
        }

        server.send(JSON.stringify(socket_msg));
    })

    try
    {
        // Wait until server is ready
        await server.ready();

        // Shouldnt really use _socket like this but its fine
        await deepgram.ready();
    }
    catch (e)
    {
        console.log(e);
        return;
    }


})();