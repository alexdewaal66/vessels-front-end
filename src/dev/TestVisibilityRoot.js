import { rootMkr } from './log';
import { useRef } from 'react';

const length = 100;
const ids = [...Array(length).keys()];

export function TestVisibilityRoot() {
const logRoot = rootMkr(TestVisibilityRoot);
const rootElementRef = useRef();

return (
    <div ref={rootElementRef} id={'root'}>

    </div>
);
}

/*

export function TestIsoRoot() {
    const logRoot = rootMkr(TestIsoRoot);
    const visibility = useIntersectionObserver(length);
    logv(logRoot, {visibility});

    return (
        <div ref={visibility.rootRef} id={'root'}>
            {visibility.isObserverReady && (
                <div>
                    {ids.map(childId =>
                        <TestIsoChild childId={childId}
                                      visibility={visibility}
                                      key={'child_' + childId}
                                      elKey={childId}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

 */