import React, {useRef} from 'react';

export function useRenderCounter(desc = 'renderCount=') {
    const renderCounter = useRef(0);
    renderCounter.current = renderCounter.current + 1;
    return <>{desc}{renderCounter.current}</>;
}
