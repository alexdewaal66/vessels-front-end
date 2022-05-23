import axios from 'axios';
import { endpoints } from './endpoints';
import { statusCodes } from './statusCodes';
import { logv, pathMkr } from '../dev/log';
import { entityTypes } from './entityTypes';

const logRoot = 'remote.js';

// enumeration of state names of a request
export const requestStates = {IDLE: 'idle', PENDING: 'pending', SUCCESS: 'success', ERROR: 'error'};

// enumeration of variable names saved in local storage
export const persistentVars = {JWT: 'JsonWebToken'};

export function addJwtToHeaders(headers = {}) {
    const jwt = localStorage.getItem(persistentVars.JWT);
    return jwt ? {
        ...headers,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt,
    } : headers;
}

export async function getRequest({endpoint, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    await makeRequest({
        method: 'get',
        endpoint, requestState, onSuccess, onFail,
    });
}

export async function postRequest({endpoint, payload, headers, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    await makeRequest({
        method: 'post',
        endpoint, payload, headers, requestState, onSuccess, onFail
    });
}


export async function putRequest({endpoint, payload, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    await makeRequest({
        method: 'put',
        endpoint, payload, requestState, onSuccess, onFail
    });
}

export async function deleteRequest({endpoint, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    // const ignorePromise = makeRequest({
    await makeRequest({
        method: 'delete',
        endpoint, requestState, onSuccess, onFail
    });
}

export async function makeRequest({method, endpoint, payload, headers, requestState = null, onSuccess, onFail}) {
    const doLog = false;// || url.includes('files') || url.includes('images');
    const logPath = pathMkr(logRoot, makeRequest, '↓↓');
    headers = addJwtToHeaders(headers);

    requestState?.setAtPending();
    if (doLog) logv(logPath, {method, endpoint, payload, requestState, onSuccess});
    try {
        const response = await axios({
            baseURL: endpoints.baseURL,
            method,
            url: endpoint,
            headers,
            data: payload,
            timeout: 15_000,
        });
        if (doLog) logv(null, {response});
        requestState?.setAtSuccess();
        onSuccess?.(response);
    } catch (error) {
        if (error?.response)
            error.response.statusText = statusCodes[error.response.status];
        // console.log(now(), logPath, {error, method, endpoint, payload});
        requestState?.setAtError();
        requestState?.setErrorMsg(error.toString());
        onFail?.(error);
    }
}

export const remote = {

    readAllIds: async function (entityType, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/ids';
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },

    readAllSummaries: async function (entityType, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.readItemsByIds], null, [entityType.name, '↓']);
        // logv(logPath,{idArray});
        const endpoint = entityType.endpoint + '/summaries';
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        })
    },

    readAllItems: async function (entityType, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint;
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },

    readNewItems: async function (entityType, timestamp, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/changed/' + timestamp;
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },

    readByExample: async function (entityType, probe, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/findall';
        await postRequest({
            endpoint, payload: probe, requestState, onSuccess, onFail
        });
    },

    readSummariesByIds: async function (entityType, idArray, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.readItemsByIds], null, [entityType.name, '↓']);
        // logv(logPath,{idArray});
        const endpoint = entityType.endpoint + '/ids/summaries';
        await postRequest({
            endpoint,
            payload: idArray,
            requestState,
            onSuccess,
            onFail
        })
    },

    readItemsByIds: async function (entityType, idArray, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.readItemsByIds], null, [entityType.name, '↓']);
        // logv(logPath,{idArray});
        const endpoint = entityType.endpoint + '/ids';
        await postRequest({
            endpoint,
            payload: idArray,
            requestState,
            onSuccess,
            onFail
        })
    },

    findByUniqueField: async function (entityType, probe, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.findByUniqueField], null, [entityType.name, '↓']);
        // logv(logPath, {probe});
        const entries = Object.entries(probe);
        // logv(logPath, {entries});
        const hits = entries.filter(([k, v]) => !!v && (k in entityType.findItem.params));
        // logv(null, hits);
        if (hits) {
            let endpoint = entityType.endpoint + entityType.findItem.endpoint;
            hits.forEach((hit, i) => {
                const [key, value] = hit;
                const param = entityType.findItem.params[key];
                endpoint += (i === 0 ? '?' : '&') + param + '=' + value;
            });
            // logv(logPath, {endpoint});
            await getRequest({endpoint, requestState, onSuccess, onFail});
        }
    },

    read: async function (entityType, id, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/' + id;
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },

    fileUpload: async function (file, requestState, onSuccess, onFail) {
        const endpoint = entityTypes.file.endpoint;
        const headers = {'content-type': 'multipart/form-data'};
        const payload = new FormData();
        payload.append('file', file);
        await postRequest({
            endpoint, payload, headers, requestState, onSuccess, onFail
        });
    },

    create: async function (entityType, item, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint;
        if (entityType === entityTypes.file) {
            await this.fileUpload(item, requestState, onSuccess, onFail);
        } else {
            await postRequest({
                endpoint, payload: item, requestState, onSuccess, onFail
            });
        }
    },

    update: async function (entityType, item, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/' + item.id;
        await putRequest({
            endpoint, payload: item, requestState, onSuccess, onFail
        });
    },

    delete: async function (entityType, id, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/' + id;
        await deleteRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },
};


