import { useEffect, useRef } from 'react';

export function useInterval(callback, delay, immediate) {
    const savedCallback = useRef();
    const savedId = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            if (savedId.current) clearInterval(savedId.current);
            if (immediate) tick();// first call by setInterval is *after* first delay
            let id = setInterval(tick, delay);
            savedId.current = id;
            return () => clearInterval(id);
        }
    }, [delay]);
}