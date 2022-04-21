import { now } from '../helpers/utils';

// const loggedPaths = [
//     // makeRequest.name,
//     // SummaryListSmall.name,
// ];

export function includesAny(haystack, ...needles) {
    //example: includesAny('image,file,vessel', entityType.name
    haystack = haystack.toLowerCase();
    return needles.some((needle) => haystack.includes(needle.toLowerCase()));
}

export function cLogv(path, vars) {

}

function quotedStringsJoin(args) {
    return  args?.map(arg => (typeof arg === 'string') ? `'${arg}'` : arg).join(', ') || '';
}

export function rootMkr(component, ...args) {
    return (typeof component === 'function')
        ? `${component.name}(${quotedStringsJoin(args)})`
        : component.endsWith('.js')
            ? component
            : component + '.';
}

export function pathMkr(logRoot, currentFunction, ...args) {
    if (Array.isArray(currentFunction)) {
        let path = `${logRoot} » `;
        currentFunction.forEach((e, i) => {
            path += rootMkr(e, args[i]);
            path += (typeof e === 'string' || i === args.length-1) ? '' : ' » '
        });
        return path;
    } else
        return `${logRoot} » ${rootMkr(currentFunction, args)}`;
}

export function logv(path, vars, prompt) {
    prompt = prompt || '';
    if (path) {
        console.log(now(), '\n' + path);
        prompt = '\t' + prompt + ' ';
    } else {
        prompt = '^\t' + prompt + ' ';
    }
    if (vars) {
        for (const [key, value] of Object.entries(vars)) {
            console.log(prompt + key + '=', value);
        }
    }
}

export function errv(path, vars, prompt) {
    logv(path, vars, prompt);
    console.error(prompt);
}
