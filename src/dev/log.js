import { now } from '../helpers/utils';
/* eslint-disable no-unused-vars */
import { EditButtons, EditEntity, Input, InputImageFile, InputObject, ValidationMessage } from '../components';
import { SummaryHeading, SummaryListSmall, SummaryRow } from '../components/summaryList';
import { useStorage } from '../helpers/useStorage';
import { getTypeFieldFromPath } from '../helpers/globals/entityTypes';
import { makeRequest, remote } from '../helpers';
import { useCounter } from './useCounter';
import { ShowObject } from '../components/ShowObject';
import { AuthContextProvider } from '../contexts';
import { useAccessStatus } from '../helpers/useAccessStatus';
import { accessPurposes, hasAccess } from '../helpers/globals/levels';
import { Menu } from '../pageLayouts';
import { Goto } from '../components/summaryList/Goto';
import { SummaryListTall } from '../components/summaryList/SummaryListTall';
/* eslint-enable no-unused-vars */

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

function typeDescription(value) {
    let type = typeof value;
    return (value == null || type !== 'object') ? type : value.constructor.name;
}

export function logv(path, vars, prompt = '') {
    if (logCounter === undefined) logCounter=0
    if (path) {
        console.log(prompt + now() + ' [' + logCounter++ + ']  ' + path);
        prompt = '\t';
    } else {
        prompt = '^\t' + prompt + ' ';
    }
    if (vars) {
        for (let [key, value] of Object.entries(vars)) {
            console.log(`${prompt} ${key} ‹${typeDescription(value)}›=`, value);
        }
    }
}

export function errv(path, vars, prompt) {
    logv(path, vars, prompt);
    console.error(prompt);
}

export function logCondition(context, ...candidates) {
    const contexts = [
        'dummy context', // just there to prevent WebStorm/ESLint from whining about "Contents of collection 'contexts' are queried, but never written"
        //// COMPONENTS:
        // Input,
        // InputObject,
        // InputImageFile,
        // SummaryListSmall,
        // SummaryListTall,
        // EditEntity,
        // EditButtons,
        // SummaryHeading,
        // SummaryRow,
        // ValidationMessage,
        // ShowObject,
        // AuthContextProvider,
        // Menu,
        // Goto,

        //// HOOKS
        // useCounter,
        // useStorage,
        // useAccessStatus,

        //// FUNCTIONS
        // getTypeFieldFromPath,
        // remote,
        // makeRequest,
        // 'Item constructor',
        // hasAccess,
        'makeMenu',

    ];

    const matches = [
        'dummy match', // just there to prevent WebStorm/EsLint from whining about "Contents of collection 'matches' are queried, but never written"
        '*', // to have an 'always' matching candidate when only the log context matters
        //// ENTITIES:
        // 'xyz','/xyzs',
        // 'zyx','/zyxs',
        // 'user', '/users',
        // 'role', '/roles',
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
        // 'username',
        // 'password',
        // 'startDate',
        // 'endDate',

        //// OTHER:
        // 'hidden_superType_propulsionType_id'
        // accessPurposes.UPDATE, accessPurposes.CREATE, accessPurposes.DELETE,
        // 'shipping', 'Shipping',
        // 'Account',

        //// SPECIFIC ITEMS
        // 'country9',
        // 'vesselType3',
    ];

    const isInContext = contexts.includes(context);
    const hasMatchingCandidate = (matches.length > 1) && [...candidates.flat()]?.some(candidate => matches.includes(candidate));
    return isInContext && hasMatchingCandidate;
}
