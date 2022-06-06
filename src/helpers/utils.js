import { fieldTypes } from './entityTypes';
// import { logv, pathMkr, rootMkr } from '../dev/log';

// const logRoot = rootMkr('utils.js');

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
    if ([fieldTypes.file, fieldTypes.img, fieldTypes.obj].includes(fieldType)) {
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

export const config = {
    showUsageHints: {value: false, label: 'tooltips'},
    devComponents: {value: false, label: 'probeersels'},
    showStore: {value: false, label: 'gegevens'},
};


export function hints(...args) {
    return config.showUsageHints.value ? args.filter(Boolean).join('\u000D') : null;
}

// export function emptyFields(fieldNames) {
//     const fields = {};
//     fieldNames.forEach(fieldName => {
//         fields[fieldName] = null;
//     });
//     return fields;
// }
