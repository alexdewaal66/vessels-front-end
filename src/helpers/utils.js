import { referringFieldTypes } from './entityTypes';
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
    // englishUI: {value: false, label: 'EN', hint: 'English'},
    showUsageHints: {value: false, label: 'tooltips'},
    devComponents: {value: true, label: 'probeersels'},
    showStore: {value: true, label: 'gegevens', hint: 'laat de cache zien, per entiteit'},
    showEntityTypes: {value: true, label: 'definities', hint: 'laat entityTypes zien, na initialisatie'},
    shortRefresh: {value: false, label: 'korte ververstijd', hint: 'tabel vraagt vaker om vernieuwde gegevens aan back end'},
};

export function language() {
    return sessionConfig.englishUI?.value ? 'EN' : 'NL';
}

export function hints(...args) {
    return sessionConfig.showUsageHints.value ? args.flat().join('\u000D') : null;
}

// export function emptyFields(fieldNames) {
//     const fields = {};
//     fieldNames.forEach(fieldName => {
//         fields[fieldName] = null;
//     });
//     return fields;
// }
