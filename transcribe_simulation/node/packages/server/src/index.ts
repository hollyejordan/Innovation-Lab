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
        console.log("saved", filePath)
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


const socket = new SocketServer(3067, LogType.ERROR | LogType.INFO);

const p = new PCMToWAV(8000, 1);

socket.on_message(m =>
{
    console.log(m)
    if (Buffer.isBuffer(m))
        p.appendBuffer(m)
}
)

setTimeout(() => p.save("tinglus.wav"), 15000)