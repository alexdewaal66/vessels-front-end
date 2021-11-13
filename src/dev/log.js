import { now } from '../helpers/utils';


export function logv(path, vars) {
    out(console.log, path, vars);
}

export function errv(path, vars) {
    out(console.error, path, vars);
}

function out(consoleMethod, path, vars) {
    let prompt;
    if (path) {
        consoleMethod(now(), '\n' + path);
        prompt = '\t';
    } else {
        prompt = '^\t';
    }
    if (!!vars) {
        for (const [key, value] of Object.entries(vars)) {
            consoleMethod(prompt + key + '=', value);
        }
    }
}
