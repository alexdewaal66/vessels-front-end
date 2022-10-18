import { now } from '../helpers/utils';
import { EditEntity, Input, InputObject, ValidationMessage } from '../components';
import { SummaryHeading, SummaryListSmall, SummaryRow } from '../components/summaryList';
import { useStorage } from '../helpers/useStorage';
import { getFieldFromPath, remote } from '../helpers';
import { useCounter } from './useCounter';

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

export function logCondition(context, ...candidates) {
    const contexts = [
        // Input,
        // InputObject,
        // SummaryListSmall,
        // 'Item constructor',
        // useStorage,
        // EditEntity,
        // remote,
        // SummaryHeading,
        // SummaryRow,
        // getFieldFromPath,
        // ValidationMessage,
        // useCounter,
    ];

    const matches = [
        //// ENTITIES:
        // 'xyz','/xyzs',
        // 'zyx','/zyxs',
        // 'user','/users',
        // 'role','/roles',
        // 'country', '/countries',
        // 'subdivision','/subdivisions',
        // 'unLocode', 'unLocode',
        // 'address','/addresses',
        // 'vesselType','/vesselTypes',
        // 'hull', '/hulls',
        // 'vessel', '/vessels',
        // 'organisation','/organisations',
        // 'relation','/relations',
        // 'relationType','/relationTypes',
        // 'file', '/files',
        // 'image', '/images',
        // 'propulsionType', '/propulsiontypes',
        //// FIELDS:
        // 'thumbnailId',
        //// OTHER:
        // 'hidden_superType_propulsionType_id'
    ];

    const isInContext = contexts.includes(context);
    const hasMatchingCandidate = [...candidates]?.some(candidate => matches.includes(candidate));
    return isInContext && hasMatchingCandidate;
}
