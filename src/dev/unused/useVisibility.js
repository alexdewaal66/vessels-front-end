import {useEffect, useState, useRef} from 'react';

export function useVisibility(elementRef, rootRef) {
    const [isVisible, setIsVisible] = useState(false);
    const intersectionObserverRef = useRef(null);
    // const elementRef = useRef(null);

    function intersectionTransitionHandler (entries) {
        const [entry] = entries; //each observer has only element to look at
        setIsVisible(entry.isIntersecting);
    }

    useEffect(() => {
        intersectionObserverRef.current = new IntersectionObserver(
            intersectionTransitionHandler, {root: rootRef?.current}
        );
    }, []);

    useEffect(() => {
        intersectionObserverRef.current.observe(elementRef.current);

        return () => {
            intersectionObserverRef.current.disconnect();
        };
    }, [elementRef]);

    return isVisible;
}
