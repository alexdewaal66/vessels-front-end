import axios from 'axios';
import { endpoints } from './endpoints';
import { statusCodes } from '../dev/statusCodes';
import { logv, pathMkr, rootMkr } from '../dev/log';

const logRoot = 'remote.js';

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

async function makeRequest({method, url, payload, headers, requestState = null, onSuccess, onFail}) {
    const doLog = false ;//|| url.includes('files') || url.includes('images');
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
        logv(logPath, {error});
        requestState?.setAtError();
        requestState?.setErrorMsg(error.toString());
        if (onFail) onFail(error);
    }
}

export const remote = {

    readIds: async function (metadata, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/ids';
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    readAll: async function (metadata, requestState, onSuccess, onFail) {
        const url = metadata.endpoint;
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    readByExample: async function (metadata, probe, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/qbe';
        await postRequest({
            url, payload: probe, requestState, onSuccess, onFail
        });
    },

    readByIds: async function (metadata, idArray, requestState, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, ['remote', remote.readByIds], null, [metadata.name, '↓']);
        // logv(logPath,{idArray});
        const url = metadata.endpoint + '/ids';
        await postRequest({
            url,
            payload: idArray,
            requestState,
            onSuccess,
            onFail
        })
    },

    findByUniqueField: async function (metadata, probe, requestState, onSuccess, onFail) {
        const logPath = pathMkr(logRoot, ['remote', remote.findByUniqueField], null, [metadata.name, '↓']);
        // logv(logPath, {probe});
        const entries = Object.entries(probe);
        // console.log(`storageHelpers » remote.findByUniqueField() \nentries=`, entries);
        const hits = entries.filter(([k, v]) => !!v && (k in metadata.findItem.params));
        // logv(null, hits);
        if (hits) {
            let url = metadata.endpoint + metadata.findItem.endpoint;
            hits.forEach((hit, i) => {
                const [key, value] = hit;
                const param = metadata.findItem.params[key];
                url += (i === 0 ? '?' : '&') + param + '=' + value;
            });
            // console.log(`storageHelpers » remote.findByUniqueField() \nurl=`, url);
            await getRequest({url, requestState, onSuccess, onFail});
        }
    },

    read: async function (metadata, id, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + id;
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    fileUpload: async function (file, requestState, onSuccess, onFail) {
        const url = '/files';
        const headers = {'content-type': 'multipart/form-data'};
        const payload = new FormData();
        payload.append('file', file);
        await postRequest({
            url, payload, headers, requestState, onSuccess, onFail
        });
    },

    create: async function (metadata, item, requestState, onSuccess, onFail) {
        const url = metadata.endpoint;
        if (metadata.name === 'file') {
            await this.fileUpload(item, requestState, onSuccess, onFail);
        } else {
            await postRequest({
                url, payload: item, requestState, onSuccess, onFail
            });
        }
    },

    update: async function (metadata, item, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + item.id;
        await putRequest({
            url, payload: item, requestState, onSuccess, onFail
        });
    },

    delete: async function (metadata, id, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + id;
        await deleteRequest({
            url, requestState, onSuccess, onFail
        });
    },
};


