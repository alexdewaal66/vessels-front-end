import axios from 'axios';
import { endpoints } from './globals/endpoints';
import { statusCodes } from './globals/statusCodes';
import { logCondition, logv, pathMkr } from '../dev/log';
import { entityTypes } from './globals/entityTypes';

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
    const doLog = logCondition(makeRequest, endpoint.split('/').map(s => !!s ? '/' + s : undefined));
    const logPath = pathMkr(logRoot, makeRequest, '↓↓');
    headers = addJwtToHeaders(headers);

    requestState?.setAtPending();
    if (doLog) logv(logPath, {method, endpoint, payload, headers, requestState, onSuccess}, '👀');
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
        // console.log(now(), logPath, {error, method, endpoint, payload, onSuccess, onFail});
        // console.error(error);
        requestState?.setAtError();
        requestState?.setErrorMsg(error.toString());
        onFail?.(error);
    }
}

export const remote = {

    retrieveAllIds: async function (entityType, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/ids';
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },

    // retrieveAllSummaries: async function (entityType, requestState, onSuccess, onFail) {
    //     // const logPath = pathMkr(logRoot, ['remote', remote.retrieveItemsByIds], null, [entityType.name, '↓']);
    //     // logv(logPath,{idArray});
    //     const endpoint = entityType.endpoint + '/summaries';
    //     await getRequest({
    //         endpoint, requestState, onSuccess, onFail
    //     })
    // },

    retrieveAllItems: async function (entityType, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint;
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },

    retrieveChangedItems: async function (entityType, timestamp, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/changed/' + timestamp;
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },

    retrieveByExample: async function (entityType, probe, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/findall';
        await postRequest({
            endpoint, payload: probe, requestState, onSuccess, onFail
        });
    },

    retrieveSummariesByIds: async function (entityType, idArray, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.retrieveItemsByIds], null, [entityType.name, '↓']);
        // logv(logPath,{idArray});
        const endpoint = entityType.endpoint + '/_ids/summaries';
        await postRequest({
            endpoint,
            payload: idArray,
            requestState,
            onSuccess,
            onFail
        })
    },

    retrieveItemsByIds: async function (entityType, idArray, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.retrieveItemsByIds], null, [entityType.name, '↓']);
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
        const hits = entries.filter(([k, v]) => !!v && (k in entityType.findParams));
        // logv(null, hits);
        if (hits) {
            let endpoint = entityType.endpoint + endpoints.findItem;
            hits.forEach((hit, i) => {
                const [key, value] = hit;
                const param = entityType.findParams[key];
                endpoint += (i === 0 ? '?' : '&') + param + '=' + value;
            });
            // logv(logPath, {endpoint});
            await getRequest({endpoint, requestState, onSuccess, onFail});
        }
    },

    retrieve: async function (entityType, id, requestState, onSuccess, onFail) {
        const endpoint = entityType.endpoint + '/' + id;
        await getRequest({
            endpoint, requestState, onSuccess, onFail
        });
    },

    fileUpload: async function (file, requestState, onSuccess, onFail) {
        const doLog = logCondition(remote, 'file');
        const endpoint = entityTypes.file.uploadEndpoint;
        const headers = {'Content-Type': 'multipart/form-data'};
        const payload = new FormData();
        payload.append('file', file);
        if (doLog) logv(pathMkr(logRoot, this.fileUpload), {file, requestState, endpoint, headers});
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
        const logPath = pathMkr(logRoot, remote.update);
        const doLog = logCondition(remote, entityType.name);
        if (doLog) {
            const json = JSON.stringify(item);
            logv(logPath, {entityName: entityType.name, item, json});
        }
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


