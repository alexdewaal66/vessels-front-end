const dev = true;

export const sessionConfig = {
    englishUI: {
        value: false, label: 'EN',
        hint: {NL: 'Select for English', EN: 'Deselecteer voor Nederlands'},
    },
    showUsageHints: {
        value: true, label: 'tooltips'
    },
    collapseInputObject: {
        value: true,
        label: {NL: 'klap tabellen in', EN: 'collapse tables',},
        hint: {
            NL: 'invoertabellen worden standaard ingeklapt',
            EN: 'collapse input tables by default',
        },
    },
    devComponents: {
        value: false,
        label: {NL: 'extra\'s', EN: 'extras',},
        hint: {
            NL: 'dev/admin componenten',
            EN: 'dev/admin components',
        },
    },
    showEntities: {
        dev,
        value: false,
        label: {NL: 'gegevens & definities', EN: 'data & definitions',},
        hint: {
            NL: ['laat de cache zien, per entiteit', 'en de entityTypes zien, na initialisatie'],
            EN: ['show cache, by entity', 'and entityTypes, after initialisation'],
        },
    },
    shortRefresh: {
        dev,
        value: false,
        label: {NL: 'korte ververstijd', EN: 'fast refresh',},
        hint: {
            NL: 'tabel vraagt vaker om vernieuwde gegevens aan back end',
            EN: 'table asks more often for renewed data from back end',
        },
    },
    showHiddenFields: {
        dev,
        value: false,
        label: {NL: 'verborgen velden', EN: 'hidden fields',},
        hint: {
            NL: 'maak de verborgen formuliervelden zichtbaar van invoer componenten',
            EN: 'show the hidden form fields of input components',
        },
    },

};