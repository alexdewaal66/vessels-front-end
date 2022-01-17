import { now } from '../helpers';

// const loggedPaths = [
//     // makeRequest.name,
//     // SummaryListSmall.name,
// ];

export function includesAny(haystack, ...needles) {
    haystack = haystack.toLowerCase();
    return needles.some((needle) => haystack.includes(needle.toLowerCase()));
}

export function cLogv(path, vars) {

}

export function logv(path, vars, prompt) {
    out(console.log, path, vars, prompt);
}

export function errv(path, vars, prompt) {
    out(console.error, path, vars, prompt);
}

function out(consoleMethod, path, vars, prompt) {
    prompt = prompt || '';
    if (path) {
        consoleMethod(now(), '\n' + path);
        prompt = '\t' + prompt + ' ';
    } else {
        prompt = '^\t' + prompt + ' ';
    }
    if (vars) {
        for (const [key, value] of Object.entries(vars)) {
            consoleMethod(prompt + key + '=', value);
        }
    }
}
