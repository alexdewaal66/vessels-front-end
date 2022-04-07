import { useIntersectionChild } from './useIntersectionChild';
// import { logv, rootMkr } from './log';

const numbers = [...Array(10).keys()];

export function TestIsoChild({childId, visibility, elKey}) {
    // const logRoot = rootMkr(TestIsoChild);
    // logv(logRoot, {childId, visibility});

    const {elementRef, isVisible} = useIntersectionChild(visibility, childId);

    const style = isVisible
        ? {border: '1px solid red', color: 'red'}
        : {border: '1px solid blue', color: 'blue'};

    return (
        <>
            <div style={style}>
                {numbers.map(x => <div key={elKey + '_↓_' + x}>&nbsp;↓&nbsp;</div>)}
            </div>
            <div ref={elementRef} style={{border: isVisible ? '1px solid red' : '1px solid blue'}} id={childId}>
                {childId}
            </div>
            <div style={style}>
                {numbers.map(x => <div key={elKey + '_↑_' + x}>&nbsp;↑&nbsp;</div>)}
            </div>
            <br/>
        </>
    );
}