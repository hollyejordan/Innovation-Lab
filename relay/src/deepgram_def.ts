
// Broke it down a bit, didnt include stuff that is useless
interface TranscriptMeta
{
    // Probably useless but here incase i need it later
}

interface TranscriptWord
{
    word: string;
    start: number;
    end: number;
    confidence: number;
    speaker: number;
    speaker_confidence: number;
}

interface TranscriptWord
{
    word: string;
    start: number;
    end: number;
    confidence: number;
    speaker: number;
    speaker_confidence: number;
}

interface TranscriptAlternative
{
    // All words, no extra info
    transcript: string;
    confidence: number;

    // Each word and its info
    words: Array<TranscriptWord>;
}

export interface TranscriptResponse
{
    metadata: TranscriptMeta;
    type?: string;
    channel?:
    {
        alternatives: Array<TranscriptAlternative>
    };
}

export enum Encoding
{
    PCM = "linear16"
}