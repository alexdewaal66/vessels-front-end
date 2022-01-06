import axios from 'axios';
import { endpoints } from './endpoints';
import { statusCodes } from '../dev/statusCodes';
import { logv, errv } from '../dev/log';

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

export async function postRequest({url, payload, requestState, onSuccess, onFail}) {
    // eslint-disable-next-line no-unused-vars
    await makeRequest({
        method: 'post',
        url, payload, requestState, onSuccess, onFail
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

export async function makeRequest({method, url, payload, requestState = null, onSuccess, onFail}) {
    const doLog = false;// url.includes('xyz') || url.includes('zyx');
    const logPath = '----------------' + makeRequest.name + '() ';
    const headers = addJwtToHeaders();

    requestState?.setAtPending();
    if (doLog) logv(logPath + 'arguments=', {method, url, payload, requestState, onSuccess});
    try {
        const response = await axios({
            baseURL: endpoints.baseURL,
            method,
            url,
            headers,
            data: payload,
            timeout: 15_000,
        });
        if (doLog) logv(logPath + 'response=', {response});
        requestState?.setAtSuccess();
        if (onSuccess) onSuccess(response);
    } catch (e) {
        if (e?.response)
            e.response.statusText = statusCodes[e.response.status];
        logv(logPath + 'error=', {e});
        requestState?.setAtError();
        requestState?.setErrorMsg(e.toString());
        if (onFail) onFail(e);
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
        // console.log(`storageHelpers » remote.readByIds()\n\t metadata=`, metadata, `\n\t idArray=`, idArray);
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
        // console.log(`storageHelpers » remote.findByUniqueField() \nprobe=`, probe, `metadata.name=`, metadata.name);
        const entries = Object.entries(probe);
        // console.log(`storageHelpers » remote.findByUniqueField() \nentries=`, entries);
        const hits = entries.filter(([k, v]) => !!v && (k in metadata.findItem.params));
        console.log(`storageHelpers » remote.findByUniqueField() \nhits=`, hits);
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

    create: async function (metadata, item, requestState, onSuccess, onFail) {
        const url = metadata.endpoint;
        await postRequest({
            url, payload: item, requestState, onSuccess, onFail
        });
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

