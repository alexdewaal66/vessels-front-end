import { useEffect, useRef, useState } from 'react';


export function useIntersectionChild(visibility, index) {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current
        visibility.registerElement(index, element, isVisible, setIsVisible);
        return () => {
            visibility.unregisterElement(element, index);
            console.log(`unregister(${index})`);
        };
    }, []);

    return {
        elementRef,
        isVisible
    };
}