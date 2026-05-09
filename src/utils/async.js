export async function raceWithTimeoutAndAbort(promise, opts) {
    const { timeoutMs, abortSignal } = opts;
    let timeoutId;
    let abortHandler;
    const timeoutOutcome = new Promise((resolve) => {
        timeoutId = setTimeout(() => resolve({ kind: "timeout" }), timeoutMs);
    });
    const abortOutcome = abortSignal
        ? new Promise((resolve) => {
            if (abortSignal.aborted) {
                resolve({ kind: "aborted" });
                return;
            }
            abortHandler = () => resolve({ kind: "aborted" });
            abortSignal.addEventListener("abort", abortHandler, { once: true });
        })
        : new Promise(() => { });
    try {
        const winner = await Promise.race([
            promise.then((value) => ({ kind: "success", value })),
            timeoutOutcome,
            abortOutcome,
        ]);
        if (winner.kind === "success") {
            return { status: "success", value: winner.value };
        }
        if (winner.kind === "timeout") {
            return { status: "timeout" };
        }
        return { status: "aborted" };
    }
    finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (abortSignal && abortHandler) {
            abortSignal.removeEventListener("abort", abortHandler);
        }
    }
}
