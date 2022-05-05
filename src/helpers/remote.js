import axios from 'axios';
import { endpoints } from './endpoints';
import { statusCodes } from '../dev/statusCodes';
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

export async function getRequest({url, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    await makeRequest({
        method: 'get',
        url, requestState, onSuccess, onFail,
    });
}

export async function postRequest({url, payload, headers, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    await makeRequest({
        method: 'post',
        url, payload, headers, requestState, onSuccess, onFail
    });
}


export async function putRequest({url, payload, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    await makeRequest({
        method: 'put',
        url, payload, requestState, onSuccess, onFail
    });
}

export async function deleteRequest({url, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    // const ignorePromise = makeRequest({
    await makeRequest({
        method: 'delete',
        url, requestState, onSuccess, onFail
    });
}

export async function makeRequest({method, url, payload, headers, requestState = null, onSuccess, onFail}) {
    const doLog = false;// || url.includes('files') || url.includes('images');
    const logPath = pathMkr(logRoot, makeRequest, '↓↓');
    headers = addJwtToHeaders(headers);

    requestState?.setAtPending();
    if (doLog) logv(logPath, {method, url, payload, requestState, onSuccess});
    try {
        const response = await axios({
            baseURL: endpoints.baseURL,
            method,
            url,
            headers,
            data: payload,
            timeout: 15_000,
        });
        if (doLog) logv(null, {response});
        requestState?.setAtSuccess();
        if (onSuccess) onSuccess(response);
    } catch (error) {
        if (error?.response)
            error.response.statusText = statusCodes[error.response.status];
        logv(logPath, {error, method, url, payload});
        requestState?.setAtError();
        requestState?.setErrorMsg(error.toString());
        if (onFail) onFail(error);
    }
}

export const remote = {

    readAllIds: async function (entityType, requestState, onSuccess, onFail) {
        const url = entityType.endpoint + '/ids';
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    readAllSummaries: async function (entityType, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.readItemsByIds], null, [entityType.name, '↓']);
        // logv(logPath,{idArray});
        const url = entityType.endpoint + '/summaries';
        await getRequest({
            url, requestState, onSuccess, onFail
        })
    },

    readAllItems: async function (entityType, requestState, onSuccess, onFail) {
        const url = entityType.endpoint;
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    readNewItems: async function (entityType, timestamp, requestState, onSuccess, onFail) {
        const url = entityType.endpoint + '/changed/' + timestamp;
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    readByExample: async function (entityType, probe, requestState, onSuccess, onFail) {
        const url = entityType.endpoint + '/qbe';
        await postRequest({
            url, payload: probe, requestState, onSuccess, onFail
        });
    },

    readSummariesByIds: async function (entityType, idArray, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.readItemsByIds], null, [entityType.name, '↓']);
        // logv(logPath,{idArray});
        const url = entityType.endpoint + '/ids/summaries';
        await postRequest({
            url,
            payload: idArray,
            requestState,
            onSuccess,
            onFail
        })
    },

    readItemsByIds: async function (entityType, idArray, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.readItemsByIds], null, [entityType.name, '↓']);
        // logv(logPath,{idArray});
        const url = entityType.endpoint + '/ids';
        await postRequest({
            url,
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
            let url = entityType.endpoint + entityType.findItem.endpoint;
            hits.forEach((hit, i) => {
                const [key, value] = hit;
                const param = entityType.findItem.params[key];
                url += (i === 0 ? '?' : '&') + param + '=' + value;
            });
            // logv(logPath, {url});
            await getRequest({url, requestState, onSuccess, onFail});
        }
    },

    read: async function (entityType, id, requestState, onSuccess, onFail) {
        const url = entityType.endpoint + '/' + id;
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    fileUpload: async function (file, requestState, onSuccess, onFail) {
        const url = entityTypes.file.endpoint;
        const headers = {'content-type': 'multipart/form-data'};
        const payload = new FormData();
        payload.append('file', file);
        await postRequest({
            url, payload, headers, requestState, onSuccess, onFail
        });
    },

    create: async function (entityType, item, requestState, onSuccess, onFail) {
        const url = entityType.endpoint;
        if (entityType === entityTypes.file) {
            await this.fileUpload(item, requestState, onSuccess, onFail);
        } else {
            await postRequest({
                url, payload: item, requestState, onSuccess, onFail
            });
        }
    },

    update: async function (entityType, item, requestState, onSuccess, onFail) {
        const url = entityType.endpoint + '/' + item.id;
        await putRequest({
            url, payload: item, requestState, onSuccess, onFail
        });
    },

    delete: async function (entityType, id, requestState, onSuccess, onFail) {
        const url = entityType.endpoint + '/' + id;
        await deleteRequest({
            url, requestState, onSuccess, onFail
        });
    },
};


