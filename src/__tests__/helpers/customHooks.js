import { useRequestState } from '../../helpers';
import { render} from '@testing-library/react';
import { actual, setActual, TestHook } from '../__resources__/testHook';

describe('customHooks.js', () => {
    describe('useRequestState', () => {

        describe('set Error Message using <TestHook/>', () => {

            test.each([undefined, null, 'oops'])
            ('testcase=%s', (testcase) => {
                render(<TestHook
                    useHook={useRequestState}
                    onMount={(hook) => {
                        hook.setErrorMsg(testcase);
                    }}
                    onRender={(hook) => {
                        setActual(hook.errorMsg);
                    }}
                />);
                expect(actual).toBe(testcase);
            });

        });

        describe('set State', () => {

            function onRender(hook) {
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
                    onMount={(hook) => {
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
                    onMount={(hook) => {
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
