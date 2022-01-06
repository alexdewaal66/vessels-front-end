export function now() {
    const date = new Date();
    const time = date.toLocaleTimeString();
    return `(${time}.${date.getMilliseconds().toString().padStart(3, "0")})`;
}

export function range(size) {
    return [...Array(size).keys()];
}

export function formatDate(timestamp) {
    const day = (new Date(timestamp * 1_000));
    return day.toLocaleDateString('nl-NL', {weekday: 'long'});
}

export function formatTime(timestamp) {
    const day = new Date(timestamp * 1000);
    return day.toLocaleTimeString([],);
}


export function makeId() {
    return now() + '_' + (Math.random() * 0x10_0000_0000_0000).toString(36);
}

export function compare(p, q) {
    if (typeof p === 'string' && typeof q === 'string') {
        p = p.toLowerCase();
        q = q.toLowerCase();
    }
    if (p < q) return -1;
    if (p > q) return 1;
    return 0;
}

export function emptyFields(fieldNames) {
    const fields = {};
    fieldNames.forEach(fieldName => {
        fields[fieldName] = null;
    });
    return fields;
}