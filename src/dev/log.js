import { now } from '../helpers/utils';

// const loggedPaths = [
//     // makeRequest.name,
//     // SummaryListSmall.name,
// ];

let logCounter = 0;

function quotedStringsJoin(args) {
    return args?.map(arg => (typeof arg === 'string') ? `'${arg}'` : arg).join(', ') || '';
}

export function rootMkr(component, ...args) {
    return (typeof component === 'function')
        ? `${component.name}(${quotedStringsJoin(args)})`
        : component?.endsWith('.js')
            ? component
            : component + '.';
}

export function pathMkr(logRoot, currentFunction, ...args) {
    if (Array.isArray(currentFunction)) {
        let path = `${logRoot} » `;
        currentFunction.forEach((e, i) => {
            path += rootMkr(e, args[i]);
            path += (typeof e === 'string' || i === args.length - 1) ? '' : ' » '
        });
        return path;
    } else
        return `${logRoot} » ${rootMkr(currentFunction, args)}`;
}

export function logv(path, vars, prompt = '') {
    if (path) {
        // console.log(now(), '\n' + prompt + '  ' + path);
        console.log(prompt + now() + ' [' + logCounter++ + ']  ' + path);
        prompt = '\t';
        // prompt = '\t' + prompt + ' ';
    } else {
        prompt = '^\t' + prompt + ' ';
    }
    if (vars) {
        for (let [key, value] of Object.entries(vars)) {
            console.log(prompt + key + '=', value);
        }
    }
}

export function errv(path, vars, prompt) {
    logv(path, vars, prompt);
    console.error(prompt);
}

export function logConditionally() {
    const matches = [
        // 'xyz','/xyzs',
        // 'zyx','/zyxs',
        // 'user','/users',
        // 'address','/addresses',
        // 'relation','/relations',
        // 'relationType','/relationTypes',
        // 'organisation','/organisations',
        // 'vesselType','/vesselTypes',
        // 'role','/roles',
        // 'image', '/images',
        // 'country', '/countries',
    ];
    return [...arguments]?.some(e => matches.includes(e));
}
