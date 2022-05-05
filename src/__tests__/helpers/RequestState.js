import { RequestState } from '../../helpers';

describe('class RequestState', () => {
    describe('set Error Message', () => {
        test.each([
            undefined, null, 'damn'
        ])('msg=%s', (msg) => {
            const requestState = new RequestState();
            requestState.setErrorMsg(msg);
            expect(requestState.errorMsg).toBe(msg);
        });
    });

    describe('states', () => {
        test('default is Idle', () => {
            const requestState = new RequestState();
            expect(requestState.isIdle).toBe(true);
            expect(requestState.isPending).toBe(false);
            expect(requestState.isSuccess).toBe(false);
            expect(requestState.isError).toBe(false);
        });
        test('set at Idle', () => {
            const requestState = new RequestState();
            requestState.setAtIdle();
            expect(requestState.isIdle).toBe(true);
            expect(requestState.isPending).toBe(false);
            expect(requestState.isSuccess).toBe(false);
            expect(requestState.isError).toBe(false);
        });
        test('set at Pending', () => {
            const requestState = new RequestState();
            requestState.setAtPending();
            expect(requestState.isIdle).toBe(false);
            expect(requestState.isPending).toBe(true);
            expect(requestState.isSuccess).toBe(false);
            expect(requestState.isError).toBe(false);
        });
        test('set at Success', () => {
            const requestState = new RequestState();
            requestState.setAtSuccess();
            expect(requestState.isIdle).toBe(false);
            expect(requestState.isPending).toBe(false);
            expect(requestState.isSuccess).toBe(true);
            expect(requestState.isError).toBe(false);
        });
        test('set at Error', () => {
            const requestState = new RequestState();
            requestState.setAtError();
            expect(requestState.isIdle).toBe(false);
            expect(requestState.isPending).toBe(false);
            expect(requestState.isSuccess).toBe(false);
            expect(requestState.isError).toBe(true);
        });
    });
});
