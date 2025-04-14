import { LogType, SocketPayloadType, SocketServer, SP_TranscribeResult } from 'shared';
import { Deepgram } from './Deepgram';
import { Encoding } from './deepgram_def';

const HOST_PORT = 8087;

import * as fs from 'fs';
import * as path from 'path';

class PCMToWAV
{
    private buffers: Buffer[] = [];
    private sampleRate: number;
    private channels: number;

    constructor(sampleRate: number = 2000, channels: number = 2)
    {
        this.sampleRate = sampleRate;
        this.channels = channels;
    }

    appendBuffer(buffer: Buffer)
    {
        this.buffers.push(buffer);
    }

    save(filePath: string)
    {
        const data = Buffer.concat(this.buffers);
        const header = this.createWAVHeader(data.length);
        const wavBuffer = Buffer.concat([header, data]);
        fs.writeFileSync(filePath, wavBuffer);
    }

    private createWAVHeader(dataLength: number): Buffer
    {
        const header = Buffer.alloc(44);
        const byteRate = this.sampleRate * this.channels * 2;
        const blockAlign = this.channels * 2;

        header.write('RIFF', 0); // ChunkID
        header.writeUInt32LE(36 + dataLength, 4); // ChunkSize
        header.write('WAVE', 8); // Format
        header.write('fmt ', 12); // Subchunk1ID
        header.writeUInt32LE(16, 16); // Subchunk1Size (PCM format)
        header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
        header.writeUInt16LE(this.channels, 22); // NumChannels
        header.writeUInt32LE(this.sampleRate, 24); // SampleRate
        header.writeUInt32LE(byteRate, 28); // ByteRate
        header.writeUInt16LE(blockAlign, 32); // BlockAlign
        header.writeUInt16LE(16, 34); // BitsPerSample (16-bit PCM)
        header.write('data', 36); // Subchunk2ID
        header.writeUInt32LE(dataLength, 40); // Subchunk2Size

        return header;
    }
}

(async () =>
{
    const wav = new PCMToWAV(48000, 1);
    const deepgram = new Deepgram(Encoding.PCM, 48000);

    setTimeout(() => wav.save("dingle.wav"), 15000)
    // This is what app connects to
    const server = new SocketServer(9067, LogType.INFO | LogType.ERROR | LogType.OUTGOING);
    const player = new SocketServer(8088, LogType.INFO | LogType.ERROR);
    // setTimeout(() => wav.save("test.wav"), 10000)
    server.on_message((m) =>
    {
        let str = "";
        //console.log("HI")
        if (Buffer.isBuffer(m)) deepgram.transcribe(m);
        // wav.appendBuffer(m);
        //player.send();
        // wav.appendBuffer(m)
        // Array.from(m).forEach((n) => str += n + " ");
        //  console.log(str);
    });

    deepgram.on_receive_text((t) =>
    {
        const socket_msg: SP_TranscribeResult =
        {
            type: SocketPayloadType.TRANSCRIBE_RESULT,
            text: t.text,
            diarized: t.diarized
        }

        console.log(t.diarized);
        server.send(t.text);
        //server.send(JSON.stringify(socket_msg));
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