// import { errv } from '../dev/log';
// import { logv, pathMkr } from '../dev/log';

// const logRoot = 'entityTypes.js';

import { quantities } from '../dev/UnitInput';

export const fieldTypes = {
    str: 'string',
    num: 'number',
    bool: 'boolean',
    img: 'image',
    arr: 'array',
    obj: 'object',
    date: 'date',
    url: 'url',
    file: 'file',
};

export const subtypes = {
    password: 'password',
    email: 'email',
    date: 'date',
    url: 'url',
    color: 'color',
    datetimeLocal: 'datetimeLocal',
    month: 'month',
    tel: 'tel',
    time: 'time',
    week: 'week',
};

export const entityTypes = {};
// const logRoot = 'entityTypes';


entityTypes.xyz = {
    label: 'Xyz',
    endpoint: '/xyzs',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {type: fieldTypes.num, label: 'id', readOnly: true,},
        name: {type: fieldTypes.str, label: 'naam', validation: {required: true, maxLength: 20},},
        description: {type: fieldTypes.str, label: 'beschrijving', validation: {maxLength: 1000}},
        xyzString: {type: fieldTypes.str, validation: {maxLength: 200},},
        ratio: {
            type: fieldTypes.num, validation: {
                min: {value: 0, message: 'Negatief ratio niet toegestaan.'},
            },
        },
        zyx: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        image: {type: fieldTypes.img, label: 'afbeelding', target: 'image'},
    },
    summary: ['id', 'name', 'xyzString', 'image.thumbnailId'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.zyx = {
    label: 'Zyx',
    endpoint: '/zyxs',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
        },
        name: {
            type: fieldTypes.str, label: 'naam', validation: {maxLength: 100},
        },
        description: {
            type: fieldTypes.str, label: 'beschrijving', validation: {maxLength: 1000}
        },
    },
    summary: ['id', 'name'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.user = {
    label: 'Gebruiker',
    endpoint: '/users',
    id: ['username'],
    hasBulkLoading: true,
    fields: {
        username: {
            label: 'username', type: fieldTypes.str, readOnly: true, validation: {maxLength: 256},
        },
        password: {
            label: 'password', type: fieldTypes.str, validation: {
                required: true, maxLength: 256,
            }
        },
        enabled: {
            label: 'enabled', type: fieldTypes.bool
        },
        apikey: {
            label: 'apikey', type: fieldTypes.str, validation: {maxLength: 256},
        }
        ,
        email: {
            label: 'email', type: fieldTypes.str, subtype: subtypes.email, validation: {maxLength: 254},
        }
        ,
        authorities: {
            label: 'machtigingen', type: fieldTypes.obj, target: 'authority',
            hasNull: false, isMulti: true, validation: {required: true,}
        },
    },
    summary: ['id', 'email'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};
Object.defineProperty(entityTypes.user.fields, 'id', {
    enumerable: true,
    get() {
        return this.username;
    }
});

entityTypes.authority = {
    label: 'Machtiging',
    endpoint: '/users/{username}/authorities',
    id: ['username', 'role'],
    hasBulkLoading: false,
    fields: {
        username: {
            type: fieldTypes.str, label: 'username', validation: {maxLength: 100},
        },
        role: {
            type: fieldTypes.str, label: 'rol', validation: {maxLength: 100},
        },
    },
    summary: ['username', 'role'],
    methods: 'R',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.country = {
    label: 'Land',
    endpoint: '/countries',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {
            type: fieldTypes.num, label: 'id'
        },
        shortNameNL: {
            type: fieldTypes.str, label: 'naam (NL)', validation: {maxLength: 100},
        },
        shortNameEN: {
            type: fieldTypes.str, label: 'naam (EN)', validation: {maxLength: 100},
        },
        alpha2Code: {
            type: fieldTypes.str, label: 'alfa 2 code', validation: {maxLength: 2},
        },
        alpha3Code: {
            type: fieldTypes.str, label: 'alfa 3 code', validation: {maxLength: 3},
        },
        numericCode: {
            type: fieldTypes.str, label: 'numerieke code', validation: {maxLength: 3},
        },
    },
    summary: ['id', 'shortNameNL', 'alpha2Code', 'alpha3Code'],
    methods: 'R',
    findItem: {
        endpoint: '/find',
        params: {
            shortNameNL: 'name',
            shortNameEN: 'name',
            alpha2Code: 'code',
            alpha3Code: 'code',
            numericCode: 'code'
        },
    }
};

entityTypes.subdivision = {
    label: 'Deelsector',
    endpoint: '/subdivisions',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {
            type: fieldTypes.num, label: 'id',
        },
        alpha2Code: {
            type: fieldTypes.str, label: 'Alfa 2 code', validation: {maxLength: 2},
            details: 'country',
        },
        subdivisionCode: {
            type: fieldTypes.str, label: 'Code', validation: {maxLength: 3},
        },
        name: {
            type: fieldTypes.str, label: 'Naam', validation: {maxLength: 150},
        },
        type: {
            type: fieldTypes.str, label: 'Type', validation: {maxLength: 100},
        },
    },
    summary: ['id', 'name', 'alpha2Code', 'subdivisionCode'],
    // selectors: ['name', 'alpha2Code'],
    methods: 'R',
    findItem: {
        endpoint: '/find',
        params: {
            subdivisionCode: 'subcode',
            alpha2Code: 'alpha2code',
        },
    },
};

entityTypes.unLocode = {
    label: 'Locatiecode',
    endpoint: '/un_locode',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {
            type: fieldTypes.num, label: 'id',
        },
        change: {
            type: fieldTypes.str, label: 'change', validation: {maxLength: 3},
        },
        alpha2Code: {
            type: fieldTypes.str, label: 'alfa 2 code', validation: {maxLength: 2}, details: 'country',
        },
        locationCode: {
            type: fieldTypes.str, label: 'locatie code', validation: {maxLength: 3},
        },
        nameDiacritics: {
            type: fieldTypes.str, label: 'naam (met accenttekens)', validation: {maxLength: 80},
        },
        nameWoDiacritics: {
            type: fieldTypes.str, label: 'naam (zonder accenttekens)', validation: {maxLength: 80},
        },
        subdivisionCode: {
            type: fieldTypes.str, label: 'deelsectorcode', validation: {maxLength: 3},
            details: 'subdivision', requires: ['alpha2Code'],
        },
        functionClassifier: {
            type: fieldTypes.str, label: 'functie classificatie', validation: {maxLength: 8}, details: 'transform',
        },
        status: {
            type: fieldTypes.str, label: 'status', validation: {maxLength: 2}, details: 'transform',
        },
        updateYear: {
            type: fieldTypes.str, label: 'Jaartal update', validation: {maxLength: 4},
        },
        iata: {
            type: fieldTypes.str, label: 'IATA', validation: {maxLength: 10},
        },
        coordinates: {
            type: fieldTypes.str, label: 'coördinaten', validation: {maxLength: 15},
        },
        remarks: {
            type: fieldTypes.str, label: 'opmerkingen', validation: {maxLength: 100},
        },
    },
    summary: ['id', 'alpha2Code', 'locationCode', 'nameWoDiacritics'],
    methods: 'R',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.address = {
    label: 'Adres',
    endpoint: '/addresses',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {
            type: fieldTypes.num, label: 'id',
        },
        address1: {
            type: fieldTypes.str, label: 'adres1', validation: {maxLength: 200},
        },
        address2: {
            type: fieldTypes.str, label: 'adres2', validation: {maxLength: 200},
        },
        city: {
            type: fieldTypes.str, label: 'plaats', validation: {maxLength: 100},
        },
        postalCode: {
            type: fieldTypes.str, label: 'postcode', validation: {maxLength: 20},
        },
        country: {
            type: fieldTypes.obj, hasNull: true, isMulti: false,
            //     label: 'land', target: 'country',
        },
    },
    methods: 'CRUD',
    summary: ['id', 'address1', 'address2', 'city', 'country.alpha2Code'],
    findItem: {
        endpoint: '/find',
        params: {},
    },
}


entityTypes.vesselType = {
    label: 'Scheepstype',
    endpoint: '/vesseltypes',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
        },
        nameNL: {
            type: fieldTypes.str, label: 'naam (NL)', validation: {maxLength: 100},
        },
        nameEN: {
            type: fieldTypes.str, label: 'naam (EN)', validation: {maxLength: 100},
        },
        descNL: {
            type: fieldTypes.str, label: 'beschrijving (NL)', validation: {maxLength: 1000},
        },
        descEN: {
            type: fieldTypes.str, label: 'beschrijving (EN)', validation: {maxLength: 1000},
        },
        tonnageMin: {
            type: fieldTypes.num, label: 'tonnage (ondergrens)', validation: {
                min: {value: 0, message: 'Negatief tonnage niet toegestaan.'},
            },
            quantity: quantities.displacement,
        },
        tonnageMax: {
            type: fieldTypes.num, label: 'tonnage (bovengrens)', validation: {
                min: {value: 0, message: 'Negatief tonnage niet toegestaan.'},
            },
            quantity: quantities.displacement,
        },
        lengthOA: {
            type: fieldTypes.num, label: 'lengte o.a.', validation: {
                min: {value: 0, message: 'Negatieve lengte niet toegestaan.'},
            },
            quantity: quantities.length,
        },
        beam: {
            type: fieldTypes.num, label: 'breedte', validation: {
                min: {value: 0, message: 'Negatieve breedte niet toegestaan.'},
            },
            quantity: quantities.length,
        },
        height: {
            type: fieldTypes.num, label: 'hoogte', validation: {
                min: {value: 0, message: 'Negatieve hoogte niet toegestaan.'},
            },
            quantity: quantities.length,
        },
        draft: {
            type: fieldTypes.num, label: 'diepgang', validation: {
                min: {value: 0, message: 'Negatieve diepgang niet toegestaan.'},
            },
            quantity: quantities.length,
        },
        superType: {
            type: fieldTypes.obj, label: 'supertype', target: 'vesselType',
            hasNull: false, isMulti: false, validation: {
                required: true, min: {value: 1, message: 'Supertype verplicht.'},
            },
        },
    },
    methods: 'CRUD',
    summary: ['id', 'nameNL', 'nameEN'],
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.hull = {
    label: 'Romp',
    endpoint: '/hulls',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {type: fieldTypes.num, label: 'id', readOnly: true,},
        hullNumber: {
            type: fieldTypes.str, label: 'rompnummer', validation: {maxLength: 20},
        },
        constructionDate: {type: fieldTypes.date, label: 'bouwdatum',},
        builder: {
            type: fieldTypes.str, label: 'scheepswerf', validation: {maxLength: 255},
        },
    },
    methods: 'CRUD',
    summary: ['id', 'hullNumber'],
    findItem: {
        endpoint: '/find',
        params: {}
    }
};

entityTypes.vessel = {
    label: 'Vaartuig',
    endpoint: '/vessels',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {type: fieldTypes.num, label: 'id', readOnly: true,},
        hull: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        name: {type: fieldTypes.str, label: 'naam', validation: {maxLength: 100},},
        image: {
            type: fieldTypes.img,
            // label: 'afbeelding',
            target: 'image'
        },
        mmsi: {type: fieldTypes.str, label: 'mmsi', validation: {maxLength: 10},},
        callSign: {type: fieldTypes.str, label: 'roepletters', validation: {maxLength: 10},},
        vesselType: {
            // type: types.obj, label: 'romp', target: 'vesselType',
            type: fieldTypes.obj, hasNull: true, isMulti: false,
        },
        homePort: {
            type: fieldTypes.obj, label: 'thuishaven', target: 'unLocode', hasNull: true, isMulti: false,
        },
        lengthOA: {
            type: fieldTypes.num, label: "lengte o.a.", validation: {
                min: {value: 0, message: 'Negatieve lengte niet toegestaan.'},
            },
            quantity: quantities.length,
        },
        beam: {
            type: fieldTypes.num, label: "breedte", validation: {
                min: {value: 0, message: 'Negatieve breedte niet toegestaan.'},
            },
            quantity: quantities.length,
        },
        draft: {
            type: fieldTypes.num, label: "diepgang", validation: {
                min: {value: 0, message: 'Negatieve diepgang niet toegestaan.'},
            },
            quantity: quantities.length,
        },
        displacement: {
            type: fieldTypes.num, label: "waterverplaatsing", validation: {
                min: {value: 0, message: 'Negatieve waterverplaatsing niet toegestaan.'},
            },
            quantity: quantities.displacement,
        },
        startDate: {type: fieldTypes.date, label: "startdatum", validation: {},},
        endDate: {
            type: fieldTypes.date, label: "einddatum", validation: {},
            // crossField: {
            //     field: "startDate",
            //     validate: (thisField, thatField) => +thisField > +thatField,
            //     message: 'De einddatum mag niet voor de startdatum liggen',
            // },
        },
        // https://www.carlrippon.com/react-hook-form-cross-field-validation/
        // validate: () => crossField.validate(getValues(endDateFieldName), getValues(startDateFieldName))
        description: {
            type: fieldTypes.str, label: 'beschrijving', validation: {maxLength: 5000},
        },

    },
    methods: 'CRUD',
    summary: ['id', 'name', 'image.thumbnailId'],
    findItem: {
        endpoint: '/find',
        params: {}
    }
};

entityTypes.organisation = {
    label: 'Organisatie',
    endpoint: '/organisations',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {type: fieldTypes.num, label: 'id', readOnly: true,},
        shortName: {type: fieldTypes.str, label: 'naam', validation: {maxLength: 50},},
        longName: {type: fieldTypes.str, label: 'volledige naam', validation: {maxLength: 200},},
        description: {type: fieldTypes.str, label: 'beschrijving', validation: {maxLength: 1000},},
        url: {type: fieldTypes.str, subtype: subtypes.url, label: 'url', validation: {maxLength: 2000},},
        email: {type: fieldTypes.str, subtype: subtypes.email, label: 'email', validation: {maxLength: 320},},
        address: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
    },
    methods: 'CRUD',
    summary: ['id', 'shortName'],
    findItem: {
        endpoint: '/find',
        params: {}
    }
};

entityTypes.relation = {
    label: 'Relatie',
    endpoint: '/relations',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {type: fieldTypes.num, label: 'id', readOnly: true,},
        organisation1: {
            type: fieldTypes.obj, label: 'organisatie 1', target: 'organisation',
            hasNull: false, isMulti: false, validation: {required: true,}
        },
        relationType: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        organisation2: {
            type: fieldTypes.obj, label: 'organisatie 2', target: 'organisation',
            hasNull: false, isMulti: false, validation: {required: true,}
        },
    },
    summary: ['id', 'organisation1.shortName', 'organisation2.shortName',
        // 'relationType'
    ],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.relationType = {
    label: 'relatietype',
    endpoint: '/relationtypes',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {type: fieldTypes.num, label: 'id', readOnly: true,},
        nameNL: {type: fieldTypes.str, label: 'naam (nl)', validation: {maxLength: 100},},
        nameEN: {type: fieldTypes.str, label: 'naam (en)', validation: {maxLength: 100},},
        descNL: {type: fieldTypes.str, label: 'beschrijving (nl)', validation: {maxLength: 1000},},
        descEN: {type: fieldTypes.str, label: 'beschrijving (en)', validation: {maxLength: 1000},},
    },
    summary: ['id', 'nameNL', 'nameEN'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.file = {
    label: 'bestand',
    endpoint: '/files',
    uploadEndpoint: '/files/upload',
    downloadEndpoint: (id) => `/files/${id}/download`,
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {type: fieldTypes.num, label: 'id', readOnly: true,},
        fileName: {type: fieldTypes.str, label: 'bestandsnaam', validation: {maxLength: 259},},
        fileType: {type: fieldTypes.str, label: 'bestandstype', validation: {maxLength: 20},},
    },
    summary: ['id', 'fileName', 'fileType'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.image = {
    label: 'afbeelding',
    endpoint: '/images',
    id: ['id'],
    needsReload: true,
    fields: {
        id: {type: fieldTypes.num, label: 'id', readOnly: true,},
        fullSizeId: {type: fieldTypes.file, label: 'volledig', target: 'file',},
        thumbnailId: {type: fieldTypes.file, label: 'afbeelding', target: 'file', noEdit: true,},
    },
    summary: ['id', 'thumbnailId'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.propulsionType = {
    label: 'voortstuwing',
    endpoint: '/propulsiontypes',
    id: ['id'],
    hasBulkLoading: true,
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
        },
        nameNL: {
            type: fieldTypes.str, label: 'naam (NL)', validation: {maxLength: 100},
        },
        nameEN: {
            type: fieldTypes.str, label: 'naam (EN)', validation: {maxLength: 100},
        },
        descNL: {
            type: fieldTypes.str, label: 'beschrijving (NL)', validation: {maxLength: 1000},
        },
        descEN: {
            type: fieldTypes.str, label: 'beschrijving (EN)', validation: {maxLength: 1000},
        },
        superType: {
            type: fieldTypes.obj, label: 'supertype', target: 'propulsionType',
            hasNull: false, isMulti: false, validation: {
                required: true, min: {value: 1, message: 'Supertype verplicht.'},
            },
        },
    },
    methods: 'CRUD',
    summary: ['id', 'nameNL', 'nameEN'],
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

export function getFieldFromPath(entityTypes, entityType, fieldPath) { // ✔✔
    // depends on presence of internal reference
    const parts = fieldPath.split('.');
    const directField = entityType.fields[parts[0]];
    if (directField.type === fieldTypes.obj || directField.type === fieldTypes.img) {
        return entityTypes[directField.target].fields[parts[1]];
    }
    return directField;
}

export function initializeEntityTypes(entityTypes) { // ✔✔
    for (const entityName in entityTypes) {
        const entityType = entityTypes[entityName];
        entityType.name = entityName;
        setEveryFieldsInternalReferences(entityTypes, entityName);
        expandEveryFieldsValidations(entityTypes, entityName);
    }
}


function setEveryFieldsInternalReferences(entityTypes, entityName) { // ✔✔
    for (const [fieldName, field] of Object.entries(entityTypes[entityName].fields)) {
        if (field.type === fieldTypes.obj || field.type === fieldTypes.file)
            setInternalReference(entityTypes, entityName, fieldName); // ✔✔
    }
}

function setInternalReference(entityTypes, entityName, fieldName) { // ✔✔
    const field = entityTypes[entityName].fields[fieldName];
    if (field.target) {
        if (field.target in entityTypes) {
            if (!field.label) {
                field.label = entityTypes[field.target].label.toLowerCase();
            }
        }
    } else {
        if (fieldName in entityTypes) {
            field.target = fieldName;
            if (!field.label) {
                field.label = entityTypes[fieldName].label.toLowerCase();
            }
        }
    }
}

function expandEveryFieldsValidations(entityTypes, entityName) { // ✔✔
    for (const field of Object.values(entityTypes[entityName].fields)) {
        // if (field.type === types.str || field.type === types.num)
        expandFieldValidation(field); // ✔✔
    }
}

function expandFieldValidation(field) { // ✔✔
    if (!field?.validation) return;
    field.validation = transformEntries(field.validation, expandValidation);
}

function expandValidation([criterion, value]) { // ✔✔
    // const logPath = pathMkr(logRoot, expandValidation);
    // logv(logPath, {criterion, value});
    if (value !== null && typeof value === 'object') return [criterion, value];
    return [criterion, expansions[criterion](value)];
}

const expansions = { // ✔✔
    required: (value) => ({value, message: 'verplicht veld'}),
    maxLength: (value) => ({value, message: `maximaal ${value} karakters`}),
    minLength: (value) => ({value, message: `minimaal ${value} karakters`}),
    max: (value) => ({value, message: `niet groter dan ${value}`}),
    min: (value) => ({value, message: `niet kleiner dan ${value}`}),
};

function transformEntries(obj, callback) { // ✔✔
    return Object.fromEntries(Object.entries(obj).map(callback));
}

export function createEmptyItem(entityTypes, entityType) { // ✔✔
    // depends on presence of internal references
    // const logPath = pathMkr(logRoot, createEmptyItem, '(↓)');
    // logv(logPath, {entityName: entityType.name});
    // logv(null, {emptyObject});
    return createEmptyObject(entityTypes, entityType, Object.keys(entityType.fields));
}

export function createEmptySummary(entityTypes, entityType) { // ✔✔
    // depends on presence of internal references
    // const logPath = pathMkr(logRoot, createEmptySummary, '(↓)');
    // logv(logPath, {entityName: entityType.name});
    // logv(null, {emptyObject});
    return createEmptyObject(entityTypes, entityType, entityType.summary);
}

function createEmptyObject(entityTypes, entityType, fieldPaths) { // ✔✔
    // depends on presence of internal references
    // const logPath = pathMkr(logRoot, createEmptyObject, '(↓, ↓)');
    // logv(logPath, {entityName: entityType.name, fieldPaths});
    const item = {};
    fieldPaths.forEach(fieldPath => {
        const field = getFieldFromPath(entityTypes, entityType, fieldPath);
        // logv(null, {fieldPath, field});
        switch (field?.type) {
            case fieldTypes.str:
                item[fieldPath] = '';
                break;
            default:
                item[fieldPath] = null;
        }
    })
    return item;
}

export const entityNameList = Object.keys(entityTypes);
export const entityNames = Object.fromEntries(entityNameList.map(name => [name, name]));

export const exportedForTesting = {
    initializeEntityTypes,
    setEveryFieldsInternalReferences,
    expandEveryFieldsValidations,
    setInternalReference,
    // checkStringValidation, // obsolete by test
    // checkSummaries, // obsolete by test
    expandFieldValidation, // ✔
    expandValidation, // ✔
    expansions, // ✔
    transformEntries, // ✔
    createEmptyObject
}
