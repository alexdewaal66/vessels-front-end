import { entityTypes, referringFieldTypes } from './entityTypes';
import { pathMkr, rootMkr } from '../dev/log';

const logRoot = rootMkr('utils.js');

export function now() {
    const date = new Date();
    const time = date.toLocaleTimeString();
    return `(${time}.${date.getMilliseconds().toString().padStart(3, "0")})`;
}

// export function range(size) {
//     return [...Array(size).keys()];
// }

// export function formatDay(timestamp) {
//     const day = (new Date(timestamp * 1_000));
//     return day.toLocaleDateString('nl-NL', {weekday: 'long'});
// }

export function formatTime(timestamp) {
    const day = new Date(timestamp * 1000);
    return day.toLocaleTimeString([],);
}


export function makeId() {
    return now() + '_' + (Math.random() * 0x10_0000_0000_0000).toString(36);
}

export function dotCount(fieldPath) {
    return (fieldPath.match(/\./g) || []).length;
}

export function loCaseCompare(p, q, fieldType) {
    // const logPath = pathMkr(logRoot, loCaseCompare);
    if (referringFieldTypes.includes(fieldType)) {
        // logv(logPath, {p, q, fieldType});
        p = !!p ? p : 0;
        q = !!q ? q : 0;
    }
    if (typeof p === 'string' && typeof q === 'string') {
        p = p.toLowerCase();
        q = q.toLowerCase();
    }
    if (p < q) return -1;
    if (p > q) return 1;
    return 0;
}

export const sessionConfig = {
    englishUI: {value: false, label: 'EN', hint: {NL: 'Select for English', EN: 'Deselecteer voor Nederlands'}},
    showUsageHints: {value: false, label: 'tooltips'},
    devComponents: {
        value: true,
        label: {NL: 'extra\'s', EN: 'extras'},
        hint: {
            NL: 'dev/admin componenten',
            EN: 'dev/admin components'
        },
    },
    showStore: {
        value: true,
        label: {NL: 'gegevens', EN: 'data'},
        hint: {NL: 'laat de cache zien, per entiteit', EN: 'show cache, by entity'}
    },
    showEntityTypes: {
        value: true,
        label: {NL: 'definities', EN: 'definitions'},
        hint: {NL: 'laat entityTypes zien, na initialisatie', EN: 'show entityTypes, after initialisation'}
    },
    shortRefresh: {
        value: false,
        label: {NL: 'korte ververstijd', EN: 'fast refresh'},
        hint: {
            NL: 'tabel vraagt vaker om vernieuwde gegevens aan back end',
            EN: 'table asks more often for renewed data from back end'
        }
    },
};

export function languageSelector() {
    return sessionConfig.englishUI?.value ? 'EN' : 'NL';
}

export function text(obj, doLog, callPath = '') {
    const logPath = callPath + ' »» ' + pathMkr(logRoot, text);
    const isObject = typeof obj === 'object';
    const isString = typeof obj === 'string';
    const isNothing = !obj;

    if (isNothing || !isObject && !isString) {
        // logv(logPath, {obj}, '❌ type mismatch');
        return;
    }
    let output = obj;
    if (isString && obj.substring(0,4) === 'TEXT') {
        const [,entityName, fieldName, nr] = obj.split(':');
        output = entityTypes[entityName].fields[fieldName]
            .crossFieldChecks[+nr].text[languageSelector()];
    }
    if (isObject) output = obj[languageSelector()];
    return output;
}

export function hints(...args) {
    const isString = typeof args[0] === 'string';
    const isNothing = !args[0];
    if (!isNothing && !isString && ('NL' in args[0])) {
        args = args.map(arg => arg[languageSelector()]);
    }
    return sessionConfig.showUsageHints.value ? args.flat().join('\u000D') : null;
}

// export function emptyFields(fieldNames) {
//     const fields = {};
//     fieldNames.forEach(fieldName => {
//         fields[fieldName] = null;
//     });
//     return fields;
// }
/*

A   B       A || B    A && B    !A || !B    !A && !B

0   0           0       0           1           1
0   1           1       0           1           0
1   0           1       0           1           0
1   1           1       1           0           0

 */
export function capitalizeLabel(field) {
    const lbl = text(field.label);
    return lbl.charAt(0) + lbl.slice(1);
}