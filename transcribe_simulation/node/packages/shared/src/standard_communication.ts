import { DiarizedText } from './standard_types'

export interface SocketPayload
{
    // Want to minimise the size of each payload, I dont have too much control over this in TS however
    type: number;
}

export enum SocketPayloadType
{
    COMMAND,
    AUDIO_BUFFER,
    TRANSCRIBE_RESULT
}

// So I know exactly what to expect

// For now, I wont use this for audio, as I dont want to implement decoding base64 in c++. For now binary = audio buffer
export interface SP_AudioBuffer extends SocketPayload
{
    type: SocketPayloadType.AUDIO_BUFFER;
    buffer: string; // Will be base64 encoded
}

export interface SP_Command extends SocketPayload
{
    type: SocketPayloadType.COMMAND;

    // Not really sure how commands will be structured
    command: string;
}

export interface SP_TranscribeResult extends SocketPayload
{
    type: SocketPayloadType.TRANSCRIBE_RESULT,
    text: string, // All the text in one string
    diarized: Array<DiarizedText> // Text split into sentences by each reader
}