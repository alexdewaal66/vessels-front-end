import { useEffect } from 'react';
import { render } from '@testing-library/react';
import { useState } from 'react';

let actual;

function setActual(result) {
    actual = result;
}

function TestButton({handler, name}) {
    const [text, setText] = useState();

    function clickHandler(event) {
        handler(event, setText);
    }

    return <>
        <div data-testid={name + '_state'}>{text}</div>
        <button onClick={clickHandler}>{name}</button>
    </>
}

function TestHook({useHook, initialValue, onMount, onRender, onDismount, buttons}) {
    const hook = useHook(initialValue);
    const local = {};

    useEffect(() => {
        onMount?.(hook, local);
        if (onDismount) return () => {
            onDismount(hook, local);
        }
    }, []);

    return <div>
        {onRender(hook, local)}
        {/*{buttons && buttons.map((button) =>*/}
        {/*    <TestButton handler={button.handler} name={button.name}/>*/}
        {/*)}*/}
    </div>
}

describe('useState() using <TestHook/>', () => {
    describe('only initial value, no setState', () => {
        test.each([
            undefined, null, 'oops', -1, {}
        ])('testcase=%s', (testcase) => {
            render(<TestHook
                useHook={useState}
                initialValue={testcase}
                onMount={(hook, local) => {
                }}
                onRender={(hook, local) => {
                    setActual(hook[0]);
                }}
            />);
            expect(actual).toBe(testcase);
        });

    });

    describe('no initial value, only setState', () => {
        test.each([
            undefined, null, 'oops', -1, {}
        ])('testcase=%s', (testcase) => {
            render(<TestHook
                useHook={useState}
                onMount={(hook, local) => {
                    hook[1](testcase);
                }}
                onRender={(hook, local) => {
                    setActual(hook[0]);
                }}
            />);
            expect(actual).toBe(testcase);
        });

    });

    describe('initial value followed by setState', () => {
        test.each([
            [undefined, null],
            [null, 'oops'],
            ['oops', -1],
            [-1, {}],
            [{}, undefined]
        ])('testcase=%s', (initialValue, testcase) => {
            render(<TestHook
                useHook={useState}
                initialValue={initialValue}
                onMount={(hook, local) => {
                    hook[1](testcase);
                }}
                onRender={(hook, local) => {
                    setActual(hook[0]);
                }}
            />);
            expect(actual).toBe(testcase);
        });

    });

});

export {actual, setActual, TestHook}