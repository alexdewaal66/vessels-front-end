import axios from 'axios';
import { endpoints } from './endpoints';
import { statusCodes } from '../dev/statusCodes';

export function now() {
    const date = new Date();
    const time = date.toLocaleTimeString();
    return `(${time}.${date.getMilliseconds().toString().padStart(3, "0")})`;
}

export function range(size) {
    return [...Array(size).keys()];
}

export function formatDate(timestamp) {
    const day = (new Date(timestamp * 1_000));
    return day.toLocaleDateString('nl-NL', {weekday: 'long'});
}

export function formatTime(timestamp) {
    const day = new Date(timestamp * 1000);
    return day.toLocaleTimeString([],);
}


/******************************************/

// export function makeId(length) {
//     let result = '';
//     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     const charCount = characters.length;
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.random() * charCount);
//     }
//     return result;
// }

export function makeId() {
    return Date.now().toString(36) + '_' + (Math.random() * 0x10_0000_0000_0000).toString(36);
}

/******************************************/

export const requestStates = {IDLE: 'idle', PENDING: 'pending', SUCCESS: 'success', ERROR: 'error'};

/******************************************/

// enumeration of variable names saved in local storage
export const persistentVars = {JWT: 'JsonWebToken'};

/******************************************/

export function addJwtToHeaders(headers = {}) {
    const jwt = localStorage.getItem(persistentVars.JWT);
    return jwt ? {
        ...headers,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt,
    } : headers;
}

/******************************************/

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
    const headers = addJwtToHeaders();

    requestState?.setAtPending();
    console.log(
        now() + ' makeRequest() arguments=',
        {method, url, payload, requestState, onSuccess}
    );
    try {
        const response = await axios({
            baseURL: endpoints.baseURL,
            method,
            url,
            headers,
            data: payload,
            timeout: 15_000,
        });
        console.log(now() + ' makeRequest() response=', response);
        requestState?.setAtSuccess();
        if (onSuccess) onSuccess(response);
    } catch (e) {
        if (e?.response)
            e.response.statusText = statusCodes[e.response.status];
        console.error(now() + ' makeRequest() error=', e);
        requestState?.setAtError();
        requestState?.setErrorMsg(e.toString());
        if (onFail) onFail(e);
    }
}

/******************************************/

