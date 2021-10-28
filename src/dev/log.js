import { now } from '../helpers/utils';


export function lgv(path, vars) {
    out(console.log, path, vars);
}

export function erv(path, vars) {
    out(console.error, path, vars);
}

function out(consoleMethod, path, vars) {
    consoleMethod(now(), '\n' + path);
    for (const [key, value] of Object.entries(vars)) {
        consoleMethod('\t' + key + '=', value);
    }
}
