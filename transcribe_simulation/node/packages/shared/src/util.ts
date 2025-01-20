const INITIAL_DELAY = 5000;

export enum LogType
{
    INCOMING = 1,
    OUTGOING = 2,
    INFO = 4,
    ERROR = 8
}

// Template to retry a func a few times, there may be a logic error, but it works
export const retry = async <T>(p_promise: () => Promise<T>, max_try: number, wait: number = 0): Promise<T> =>
{
    // Delay
    if (wait !== 0) await new Promise((r) => setTimeout(r, wait));

    // Keep trying until max_try is out
    try
    {
        const out = await p_promise();
        return out;
    }
    catch (e)
    {
        if (max_try <= 1) throw e;
        // Delay is doubled every time, starting at INITIAL_DELAY after the first try
        else return retry(p_promise, max_try - 1, wait === 0 ? INITIAL_DELAY : wait * 2);
    }
};