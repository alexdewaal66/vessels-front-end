import React from 'react';
import { logv, rootMkr } from '../log';
import { useIntersectionObserver } from './useIntersectionObserver';
import { TestIsoChild } from './TestIsoChild';

const length = 10_000
const ids = [...Array(length).keys()];

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

/*
                  {ids.map(childId =>
                        visibility.isVisible(childId)
                            ? <>
                                <div style={{color: 'red'}}>#{childId}</div>
                                <br/>
                            </>
                            : <>
                                <div style={{border: 'grey'}}>#{childId}</div>
                                <br/>
                            </>
                    )}

 */