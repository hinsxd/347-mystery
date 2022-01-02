export const requestFrame = (fn: () => any, interval: number) => {
  let requestId: number;
  let lastCalledTime: number;

  const run: FrameRequestCallback = (time) => {
    if (!lastCalledTime) lastCalledTime = time;
    const delta = time - lastCalledTime;
    if (delta > interval) {
      fn();
      lastCalledTime = time;
    }
    requestId = requestAnimationFrame(run);
  };

  const start = () => {
    if (!requestId) {
      requestId = requestAnimationFrame(run);
    }
  };

  const stop = () => {
    cancelAnimationFrame(requestId);
  };
  return {
    start,
    stop,
  };
};
