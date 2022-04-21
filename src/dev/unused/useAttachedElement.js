import { useCallback, useRef } from 'react';


export function useAttachedElement() {
    const elementRef = useRef();

    const measuredRef = useCallback(node => {
        if (node !== null && elementRef.current === undefined) {
            elementRef.current = node;
        }
    }, []);

    return {elementRef, measuredRef}
}