import {
    addJwtToHeaders, deleteRequest,
    endpoints,
    getRequest, makeId,
    makeRequest,
    persistentVars, postRequest, putRequest,
    RequestState,
    requestStates
} from '../../helpers';
import axios from 'axios';
import { errorSchema, responseSchema, vesselsError, vesselsResponse } from '../testData';


jest.mock('axios', () => jest.fn());

describe('remote helper functions', () => {

    describe('addJwtToHeaders()', () => {
        const jwtValue = 'NOT A REAL JSON WEBTOKEN';
        const headers = {'non-functional key': 'equally useless value'};

        describe('no jwt in localStorage', () => {
            test('no headers argument', () => {
                localStorage.clear();
                const actual = addJwtToHeaders();
                expect(actual).toStrictEqual({});
            });
            test('with headers argument', () => {
                localStorage.clear();
                const actual = addJwtToHeaders(headers);
                expect(actual).toStrictEqual(headers);
            });

        });

        describe('with jwt in localStorage', () => {
            test('no headers argument', () => {
                localStorage.clear();
                localStorage.setItem(persistentVars.JWT, jwtValue)
                const actual = addJwtToHeaders();
                const expected = {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwtValue,
                };
                expect(actual).toStrictEqual(expected);
            });
            test('with headers argument', () => {
                localStorage.clear();
                localStorage.setItem(persistentVars.JWT, jwtValue)
                const actual = addJwtToHeaders(headers);
                const expected = {
                    'non-functional key': 'equally useless value',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwtValue,
                };
                expect(actual).toStrictEqual(expected);
            });

        });
    });

});

describe('request functions', () => {

    class SaveArgCallback {
        arg = undefined;
        saveArg = (x) => this.arg = x;
    }

    const resolve = (value) => () => Promise.resolve(value);
    const reject = (value) => () => Promise.reject(value);

    afterEach(() => {
        jest.restoreAllMocks();
    });

    function requestCases() {
        return [
            [
                '/abc', 'get', undefined, undefined,
                new RequestState(), requestStates.SUCCESS,
                new SaveArgCallback(), new SaveArgCallback(),
                responseSchema, undefined,
                resolve
            ],
            [
                '/abc', 'get', undefined, undefined,
                new RequestState(), requestStates.ERROR,
                new SaveArgCallback(), new SaveArgCallback(),
                undefined, errorSchema,
                reject
            ],
            [
                '/def', 'post', {a: 1, b: 2}, {},
                new RequestState(), requestStates.SUCCESS,
                new SaveArgCallback(), new SaveArgCallback(),
                vesselsResponse, undefined,
                resolve
            ],
            [
                '/def', 'post', {a: 1, b: 2}, {},
                new RequestState(), requestStates.ERROR,
                new SaveArgCallback(), new SaveArgCallback(),
                undefined, errorSchema,
                reject
            ],
        ];
    }

    describe('makeRequest()', () => {

        test.each(requestCases())('endpoint=%s, method=%s',
            async (
                endpoint, method, payload, headers,
                requestState, resultingState,
                onSuccess, onFail,
                response, error,
                concludePromise
            ) => {
                const config = {
                    baseURL: endpoints.baseURL,
                    method,
                    url: endpoint,
                    headers: addJwtToHeaders(headers),
                    data: payload,
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await makeRequest({
                    method, endpoint, payload, requestState,
                    onSuccess: onSuccess.saveArg, onFail: onFail.saveArg
                });
                expect(axios).toHaveBeenCalledWith(config);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('getRequest()', () => {

        test.each(requestCases())('endpoint=%s',
            async (
                endpoint, method, payload, headers,
                requestState, resultingState,
                onSuccess, onFail,
                response, error,
                concludePromise
            ) => {
                const config = {
                    baseURL: endpoints.baseURL,
                    url: endpoint,
                    headers: addJwtToHeaders(headers),
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await getRequest({
                    endpoint, payload, requestState,
                    onSuccess: onSuccess.saveArg, onFail: onFail.saveArg
                });
                expect(axios).toHaveBeenCalledWith({...config, method: 'get'});
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
        });
    });

    describe('postRequest()', () => {

        test.each(requestCases())('endpoint=%s',
            async (
                endpoint, method, payload, headers,
                requestState, resultingState,
                onSuccess, onFail,
                response, error,
                concludePromise
            ) => {
                const config = {
                    baseURL: endpoints.baseURL,
                    url: endpoint,
                    headers: addJwtToHeaders(headers),
                    data: payload,
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await postRequest({
                    endpoint, payload, requestState,
                    onSuccess: onSuccess.saveArg, onFail: onFail.saveArg
                });
                expect(axios).toHaveBeenCalledWith({...config, method: 'post'});
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
        });
    });

    describe('putRequest()', () => {

        test.each(requestCases())('endpoint=%s',
            async (
                endpoint, method, payload, headers,
                requestState, resultingState,
                onSuccess, onFail,
                response, error,
                concludePromise
            ) => {
                const config = {
                    baseURL: endpoints.baseURL,
                    url: endpoint,
                    headers: addJwtToHeaders(headers),
                    data: payload,
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await putRequest({
                    endpoint, payload, requestState,
                    onSuccess: onSuccess.saveArg, onFail: onFail.saveArg
                });
                expect(axios).toHaveBeenCalledWith({...config, method: 'put'});
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('deleteRequest()', () => {

        test.each(requestCases())('endpoint=%s',
            async (
                endpoint, method, payload, headers,
                requestState, resultingState,
                onSuccess, onFail,
                response, error,
                concludePromise
            ) => {
                const config = {
                    baseURL: endpoints.baseURL,
                    url: endpoint,
                    headers: addJwtToHeaders(headers),
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await deleteRequest({
                    endpoint, payload, requestState,
                    onSuccess: onSuccess.saveArg, onFail: onFail.saveArg
                });
                expect(axios).toHaveBeenCalledWith({...config, method: 'delete'});
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

});

describe('remote.* functions', () => {
});