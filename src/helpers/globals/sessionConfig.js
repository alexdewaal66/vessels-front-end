export const sessionConfig = {
    englishUI: {
        value: false, label: 'EN',
        hint: {NL: 'Select for English', EN: 'Deselecteer voor Nederlands'},
    },
    showUsageHints: {value: true, label: 'tooltips'},
    devComponents: {
        value: true,
        label: {NL: 'extra\'s', EN: 'extras',},
        hint: {
            NL: 'dev/admin componenten',
            EN: 'dev/admin components',
        },
    },
    collapseInputObject: {
        value: true,
        label: {NL: 'klap tabellen in', EN: 'collapse tables',},
        hint: {
            NL: 'invoertabellen worden standaard ingeklapt',
            EN: 'collapse input tables by default',
        },
    },
    showEntities: {
        value: false,
        label: {NL: 'gegevens & definities', EN: 'data & definitions',},
        hint: {
            NL: ['laat de cache zien, per entiteit', 'en de entityTypes zien, na initialisatie'],
            EN: ['show cache, by entity', 'and entityTypes, after initialisation'],
        },
    },
    shortRefresh: {
        value: false,
        label: {NL: 'korte ververstijd', EN: 'fast refresh',},
        hint: {
            NL: 'tabel vraagt vaker om vernieuwde gegevens aan back end',
            EN: 'table asks more often for renewed data from back end',
        },
    },
    showHiddenFields: {
        value: false,
        label: {NL: 'verborgen velden', EN: 'hidden fields',},
        hint: {
            NL: 'maak de verborgen formuliervelden zichtbaar van invoer componenten',
            EN: 'show the hidden form fields of input components',
        },
    },

};