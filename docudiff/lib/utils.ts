export async function withRetry<T>(
    fn: (arg: any) => Promise<T>,
    arg: any, retries = 2
): Promise<T> {
    try {
        return await fn(arg);
    } catch (err) {
        if (retries === 0) throw err;
        return withRetry(fn, arg, retries - 1);
    }
}