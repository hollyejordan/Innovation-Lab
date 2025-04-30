import { Encoding, TranscriptResponse } from "./deepgram_def";
import { LogType } from "./util";
import { DiarizedText } from "./standard_types";
import { SocketPersistent } from "./SocketPersistent";

// Hard code doesnt matter right now
const DEEPGRAM_API_KEY = "aa4cde49dc55140fbd59fd8f8f2a9b833987f145";
const DEEPGRAM_URL = "wss://api.deepgram.com/v1/listen?";
const DEEPGRAM_KEEP_AWAKE_INTERVAL = 7000;

interface TextBound
{
    text: string;
    diarized: Array<DiarizedText>;
}

export class Deepgram
{
    private socket: SocketPersistent;
    private keep_awake_timer?: NodeJS.Timeout;
    private receive_func?: (_: TextBound) => void;

    // Can be awaited
    public ready: () => Promise<void>

    public constructor(p_encoding: Encoding, p_sample_rate: number)
    {
        // Build url, these may change
        const url = DEEPGRAM_URL + "encoding=" + p_encoding + "&sample_rate=" + p_sample_rate + "&diarize=true" + "&model=nova-2" + "&filler_words=true"

        const config = {
            headers:
            {
                Authorization: `Token ${DEEPGRAM_API_KEY}`
            }
        };

        this.socket = new SocketPersistent(url, config, LogType.INFO);

        // Passing this up a level so it can be used
        this.ready = this.socket.wait_ready;

        this.socket.on_message_received((m) =>
        {
            const parsed: TranscriptResponse = JSON.parse(m.toString());
            const out: TextBound =
            {
                text: parsed.channel?.alternatives[0]?.transcript ?? "",
                diarized: this.parse_response(parsed)
            }

            // If the handler exists, and there was a text response
            if (out.text && this.receive_func) this.receive_func(out);
        });

        // Once the socket is open, it needs to start the keep awake loop
        this.socket.wait_ready().then(() =>
        {
            this.queue_keep_awake();
        })
    }

    // Send audio to transcribe
    public transcribe = (p_buffer: Buffer) =>
    {
        this.socket.send(p_buffer);

        // After each send, reset keep awake timer
        this.queue_keep_awake();
    }

    // Set event
    public on_receive_text = (p_handler: (p_text: TextBound) => void) =>
    {
        this.receive_func = p_handler;
    }

    public close_gracefully = () =>
    {
        this.socket.send(JSON.stringify({ type: 'CloseStream' }));
    }

    // Deepgram returns an array of words with a speaker id per
    // Builds this like a conversation, with a new string every time the speaker changes
    private parse_response = (p_response: TranscriptResponse): Array<DiarizedText> =>
    {
        // If this is not a results obj
        if (p_response.type !== "Results") return [];

        // Ensure there is actually a words array
        const data = p_response.channel?.alternatives[0];
        if (!data || data.words.length === 0) return [];

        const parsed: Array<DiarizedText> = [];

        data.words.forEach(word =>
        {
            // First time
            if (!parsed[0])
            {
                parsed.push({ speaker: word.speaker, text: word.word });
                return;
            }

            // Last data point in the array
            const last_point = parsed[parsed.length - 1];

            // Still the same speaker
            if (last_point.speaker === word.speaker)
            {
                last_point.text += " " + word.word;
            }
            // Speaker changed
            else
            {
                parsed.push({ speaker: word.speaker, text: word.word });
            }
        })

        return parsed;
    }

    // Sends a message to keep the connection alive
    private keep_awake = () =>
    {
        // Msg
        this.socket.send(JSON.stringify({ type: "KeepAlive" }));

        // Queue next
        this.queue_keep_awake();
    }

    // Queues the next keep awake function, will clear previous one if it exists
    private queue_keep_awake = () =>
    {
        if (this.keep_awake_timer) clearTimeout(this.keep_awake_timer);
        this.keep_awake_timer = setTimeout(this.keep_awake, DEEPGRAM_KEEP_AWAKE_INTERVAL);
    }
}