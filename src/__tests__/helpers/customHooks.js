import { keys, requestStates, useKeyPressed, useMountEffect, useRequestState } from '../../helpers';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { actual, setActual, TestHook } from '../testHook';
import userEvent from '@testing-library/user-event';

describe('customHooks.js', () => {
    describe('useRequestState', () => {

        describe('set Error Message using <TestHook/>', () => {

            test.each([
                undefined, null, 'oops'
            ])('testcase=%s', (testcase) => {
                render(<TestHook
                    useHook={useRequestState}
                    onMount={(hook, local) => {
                        hook.setErrorMsg(testcase);
                    }}
                    onRender={(hook, local) => {
                        setActual(hook.errorMsg);
                    }}
                />);
                expect(actual).toBe(testcase);
            });
        });

        describe('set State', () => {

            function onRender(hook, local) {
                setActual([
                    hook.isIdle, hook.isPending, hook.isSuccess, hook.isError
                ]);
            }

            test('default is idle', () => {
                render(<TestHook
                    useHook={useRequestState}
                    initialValue={undefined}
                    onRender={onRender}
                />);
                expect(actual).toEqual([true, false, false, false]);
            });

            test('set at Idle', () => {
                render(<TestHook
                    useHook={useRequestState}
                    initialValue={Infinity}
                    onMount={(hook, local) => {
                        hook.setAtIdle();
                    }}
                    onRender={onRender}
                />);
                expect(actual).toEqual([true, false, false, false]);
            });

            test('set at Succes', () => {
                render(<TestHook
                    useHook={useRequestState}
                    initialValue={Infinity}
                    onMount={(hook, local) => {
                        hook.setAtSuccess();
                    }}
                    onRender={onRender}
                />);
                expect(actual).toEqual([false, false, true, false]);
            });
        });
    });

    // describe('useKeyPressed', () => {
    //     test('control key', () => {
    //         const user = userEvent.setup();
    //         render(<TestHook
    //             useHook={useKeyPressed}
    //             initialValue={keys.control}
    //             onMount={}
    //             onRender={(hook, local) => {
    //                 fireEvent.keyDown(screen, createEvent())
    //             }}
    //         />);
    //     });
    // });
});
