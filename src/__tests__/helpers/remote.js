import {
    addJwtToHeaders, deleteRequest,
    endpoints, entityTypes,
    getRequest, makeId,
    makeRequest,
    persistentVars, postRequest, putRequest, remote,
    RequestState,
    requestStates
} from '../../helpers';
import axios from 'axios';
import { errorSchema, remoteResponses, responseSchema } from '../__resources__/testData';
import imageFile00 from '../__resources__/imageFile00.jpg'

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

class SaveArgCallback {
    arg = undefined;
    saveArg = (x) => this.arg = x;
}

const resolve = (value) => () => Promise.resolve(value);
const reject = (value) => () => Promise.reject(value);

describe('request functions', () => {

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
                responseSchema, undefined,
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
                axios.mockImplementationOnce(concludePromise(response || error));
                await deleteRequest({
                    endpoint, payload, requestState,
                    onSuccess: onSuccess.saveArg, onFail: onFail.saveArg
                });
                const expectedConfig = {
                    baseURL: endpoints.baseURL,
                    url: endpoint,
                    headers: addJwtToHeaders(headers),
                    timeout: 15_000,
                };
                expect(axios).toHaveBeenCalledWith({...expectedConfig, method: 'delete'});
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

});

describe('remote.* functions', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });


    function readAllXCases() {
        return [
            [
                'hull',
                new RequestState(), requestStates.SUCCESS,
                new SaveArgCallback(), new SaveArgCallback(),
                resolve,
            ],
            [
                'hull',
                new RequestState(), requestStates.ERROR,
                new SaveArgCallback(), new SaveArgCallback(),
                reject,
            ],
        ];
    }

    describe('remote.readAllIds()', () => {

        test.each(
            readAllXCases()
        )('entityName=%s',
            async (
                entityName,
                requestState, resultingState,
                onSuccess, onFail,
                concludePromise
            ) => {
                const extend = 'ids';
                let response = undefined, error = undefined;
                if (concludePromise === resolve)
                    response = remoteResponses[extend];
                else
                    error = errorSchema;
                const entityType = entityTypes[entityName];
                const expectedConfig = {
                    method: 'get',
                    baseURL: endpoints.baseURL,
                    url: entityType.endpoint + '/' + extend,
                    headers: addJwtToHeaders(),
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await remote.readAllIds(entityType, requestState, onSuccess.saveArg, onFail.saveArg);
                expect(axios).toHaveBeenCalledWith(expectedConfig);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('remote.readAllSummaries()', () => {

        test.each(
            readAllXCases()
        )('entityName=%s',
            async (
                entityName,
                requestState, resultingState,
                onSuccess, onFail,
                concludePromise
            ) => {
                const extend = 'summaries';
                let response = undefined, error = undefined;
                if (concludePromise === resolve)
                    response = remoteResponses[extend];
                else
                    error = errorSchema;
                const entityType = entityTypes[entityName];
                const expectedConfig = {
                    method: 'get',
                    baseURL: endpoints.baseURL,
                    url: entityType.endpoint + '/' + extend,
                    headers: addJwtToHeaders(),
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await remote.readAllSummaries(entityType, requestState, onSuccess.saveArg, onFail.saveArg);
                expect(axios).toHaveBeenCalledWith(expectedConfig);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('remote.readAllItems()', () => {

        test.each(
            readAllXCases()
        )('entityName=%s',
            async (
                entityName,
                requestState, resultingState,
                onSuccess, onFail,
                concludePromise
            ) => {
                const extend = 'items';
                let response = undefined, error = undefined;
                if (concludePromise === resolve)
                    response = remoteResponses[extend];
                else
                    error = errorSchema;
                const entityType = entityTypes[entityName];
                const expectedConfig = {
                    method: 'get',
                    baseURL: endpoints.baseURL,
                    url: entityType.endpoint,
                    headers: addJwtToHeaders(),
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await remote.readAllItems(entityType, requestState, onSuccess.saveArg, onFail.saveArg);
                expect(axios).toHaveBeenCalledWith(expectedConfig);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('remote.readNewItems()', () => {

        test.each(
            readAllXCases()
        )('entityName=%s',
            async (
                entityName,
                requestState, resultingState,
                onSuccess, onFail,
                concludePromise
            ) => {
                const extend = 'items';
                let response = undefined, error = undefined;
                if (concludePromise === resolve)
                    response = remoteResponses[extend];
                else
                    error = errorSchema;
                const entityType = entityTypes[entityName];
                const expectedConfig = {
                    method: 'get',
                    baseURL: endpoints.baseURL,
                    url: entityType.endpoint + '/changed/1640995200000',
                    headers: addJwtToHeaders(),
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await remote.readNewItems(entityType, '1640995200000', requestState, onSuccess.saveArg, onFail.saveArg);
                expect(axios).toHaveBeenCalledWith(expectedConfig);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('remote.readItemsByIds()', () => {

        test.each(
            addCols(readAllXCases(), [1])
        )('entityName=%s',
            async (
                entityName,
                requestState, resultingState,
                onSuccess, onFail,
                concludePromise,
                idArray
            ) => {
                const extend = 'items';
                let response = undefined, error = undefined;
                if (concludePromise === resolve)
                    response = remoteResponses[extend];
                else
                    error = errorSchema;
                const entityType = entityTypes[entityName];
                const expectedConfig = {
                    method: 'post',
                    baseURL: endpoints.baseURL,
                    url: entityType.endpoint + '/ids',
                    headers: addJwtToHeaders(),
                    data: idArray,
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(response || error));
                await remote.readItemsByIds(entityType, idArray, requestState, onSuccess.saveArg, onFail.saveArg);
                expect(axios).toHaveBeenCalledWith(expectedConfig);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(response);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('remote.findByUniqueField()', () => {

        const unLocode360 = {
            alpha2Code: "AT",
            change: null,
            coordinates: "4807N 01401E",
            functionClassifier: "1----6--",
            iata: null,
            id: 360,
            locationCode: "SUS",
            nameDiacritics: "Steinhaus",
            nameWoDiacritics: "Steinhaus",
            owner: null,
            remarks: null,
            status: "RL",
            subdivisionCode: "4",
            timestamp: 1640991600000,
            updateYear: "1201",
            updater: null,
        };

        const subdivision125 = {
            alpha2Code: "AT",
            id: 125,
            name: "Oberösterreich",
            owner: null,
            subdivisionCode: "4",
            timestamp: 1640991600000,
            type: "state",
            updater: null,
        };

        test.each([
            [
                'subdivision',
                unLocode360,
                '/subdivisions/find?alpha2code=AT&subcode=4',
                new RequestState(), requestStates.SUCCESS,
                new SaveArgCallback(), new SaveArgCallback(),
                subdivision125, undefined,
                resolve,
            ],
            [
                'subdivision',
                unLocode360,
                '/subdivisions/find?alpha2code=AT&subcode=4',
                new RequestState(), requestStates.ERROR,
                new SaveArgCallback(), new SaveArgCallback(),
                undefined, errorSchema,
                reject,
            ],
        ])('entityName=%s , probe=%o , endpoint=%s',
            async (
                entityName,
                probe,
                expectedEndpoint,
                requestState, resultingState,
                onSuccess, onFail,
                result, error,
                concludePromise,
            ) => {
                const entityType = entityTypes[entityName];
                const expectedConfig = {
                    method: 'get',
                    baseURL: endpoints.baseURL,
                    url: expectedEndpoint,
                    headers: addJwtToHeaders(),
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(result || error));
                await remote.findByUniqueField(entityType, probe, requestState, onSuccess.saveArg, onFail.saveArg);
                expect(axios).toHaveBeenCalledWith(expectedConfig);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(result);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('remote.read()', () => {

        const vessel1 = {
            "id": 1,
            "timestamp": 1640991600000,
            "owner": null,
            "updater": null,
            "hull": {},
            "name": "Sc Nordic",
            "image": null,
            "mmsi": null,
            "callSign": null,
            "vesselType": {},
            "homePort": {},
            "length": 110.0,
            "beam": 18.0,
            "draft": 5.6,
            "displacement": 4876.0,
            "startDate": 504918000000,
            "endDate": null
        };

        test.each([
            [
                'vessel', 1,
                new RequestState(), requestStates.SUCCESS,
                new SaveArgCallback(), new SaveArgCallback(),
                vessel1, undefined,
                resolve,
            ]
        ])('entityName=%s , id=%n',
            async (
                entityName, id,
                requestState, resultingState,
                onSuccess, onFail,
                result, error,
                concludePromise,
            ) => {
                const entityType = entityTypes[entityName];
                const expectedConfig = {
                    method: 'get',
                    baseURL: endpoints.baseURL,
                    url: entityType.endpoint + '/' + id,
                    headers: addJwtToHeaders(),
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(result || error));
                await remote.read(entityType, id, requestState, onSuccess.saveArg, onFail.saveArg);
                expect(axios).toHaveBeenCalledWith(expectedConfig);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(result);
                expect(onFail.arg).toEqual(error);
            });
    });

    describe('fileUpload()', () => {


        test.each([
            [
                imageFile00,
                new RequestState(), requestStates.SUCCESS,
                new SaveArgCallback(), new SaveArgCallback(),
                {}, undefined,
                resolve,
            ]
        ])('file=%o',
            async (
                file,
                requestState, resultingState,
                onSuccess, onFail,
                result, error,
                concludePromise,
            ) => {
                const entityType = entityTypes.file;
                const payload = new FormData();
                payload.set('file', file);

                const expectedConfig = {
                    method: 'post',
                    baseURL: endpoints.baseURL,
                    url: entityType.endpoint,
                    headers: addJwtToHeaders({'content-type': 'multipart/form-data'}),
                    data: payload,
                    timeout: 15_000,
                };
                axios.mockImplementationOnce(concludePromise(result || error));
                await remote.fileUpload(file, requestState, onSuccess.saveArg, onFail.saveArg);
                expect(axios).toHaveBeenCalledWith(expectedConfig);
                expect(requestState.value).toBe(resultingState);
                expect(onSuccess.arg).toEqual(result);
                expect(onFail.arg).toEqual(error);
        });
    });

});

function addCols(matrix, ...cols) {
    cols.forEach(col => matrix = matrix.map((row, i) => row.concat(col[i])))
    return matrix
}
