import { useRef } from 'react';

export function useSpinner() {
    const elementRef = useRef(document.getElementById('root'));
    const oldCursorRef = useRef('');

    function wait() {
        if (elementRef.current) {
            oldCursorRef.current = elementRef.current.style.cursor;
            elementRef.current.style.cursor = 'wait';
        }
    }

    function clear() {
        if (elementRef.current) elementRef.current.style.cursor = oldCursorRef.current;
    }

    return {wait, clear};
}