import axios from 'axios';
import { endpoints } from './endpoints';

export function now() {
    const time = (new Date()).toLocaleTimeString();
    return `(${time})`;
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

export function makeId(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charCount = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.random() * charCount);
    }
    return result;
}

/******************************************/

export const requestStates = {IDLE: 'idle', PENDING: 'pending', SUCCESS: 'success', ERROR: 'error'};

/******************************************/

// enumeration of variable names saved in local storage
export const persistentVars = {Jwt: 'JsonWebToken'};

/******************************************/

export function addJwtToHeaders(headers, Jwt) {
    return {
        ...headers,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Jwt,
    };
}


/******************************************/

export function postRequest({url, headers, payload, requestState, onSuccess}) {
    const ignorePromise = makeRequest({
        method: 'post',
        url, headers, payload, requestState, onSuccess,
    });
}

export function putRequest({url, headers, payload, requestState, onSuccess}) {
    const ignorePromise = makeRequest({
        method: 'put',
        url, headers, payload, requestState, onSuccess,
    });
}

export function getRequest({url, headers, requestState, onSuccess}) {
    const ignorePromise = makeRequest({
        method: 'get',
        url, headers, requestState, onSuccess,
    });
}

export async function makeRequest({method, url, headers, payload, requestState, onSuccess}) {
    requestState.setAtPending();
    console.log(
        now() + ' makeRequest() arguments=',
        {method, url, headers, payload, requestState, onSuccess}
    );
    try {
        const response = await axios({
            baseURL: endpoints.baseURL,
            method,
            url,
            headers,
            data: payload,
            timeout: 5_000,
        });
        console.log(now() + 'makeRequest() response=', response);
        requestState.setAtSuccess();
        if (onSuccess) onSuccess(response);
    } catch (e) {
        console.error(now(), e);
        requestState.setAtError();
        requestState.setErrorMsg(e.toString());
    }
}

/******************************************/
