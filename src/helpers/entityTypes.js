// import { errv } from '../dev/log';
import { logv, pathMkr } from '../dev/log';

const logRoot = 'entityTypes.js';

export const types = {
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
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        name: {
            type: types.str, label: 'naam', validation: {required: true, maxLength: 20},
        },
        description: {
            type: types.str, label: 'beschrijving', validation: {maxLength: 1000}
        },
        xyzString: {
            type: types.str, validation: {maxLength: 200},
        },
        ratio: {
            type: types.num, validation: {
                min: {value: 0, message: 'Negatief ratio niet toegestaan.'},
                // min: 0,
            },
        },
        zyx: {
            type: types.obj, hasNull: true, isMulti: false,
        },
        image: {
            type: types.img, label: 'afbeelding', target: 'image'
        },
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
    properties: {
        id: {
            type: types.num, label: 'id', readOnly: true,
        },
        name: {
            type: types.str, label: 'naam', validation: {maxLength: 100},
        },
        description: {
            type: types.str, label: 'beschrijving', validation: {maxLength: 1000}
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
    properties: {
        username: {
            label: 'username', type: types.str, readOnly: true, validation: {maxLength: 256},
        },
        password: {
            label: 'password', type: types.str, validation: {
                required: true, maxLength: 256,
            }
        },
        enabled: {
            label: 'enabled', type: types.bool
        },
        apikey: {
            label: 'apikey', type: types.str, validation: {maxLength: 256},
        }
        ,
        email: {
            label: 'email', type: types.str, subtype: subtypes.email, validation: {maxLength: 254},
        }
        ,
        authorities: {
            label: 'machtigingen', type: types.obj, target: 'authority',
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
Object.defineProperty(entityTypes.user.properties, 'id', {
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
    properties: {
        username: {
            type: types.str, label: 'username', validation: {maxLength: 100},
        },
        role: {
            type: types.str, label: 'rol', validation: {maxLength: 100},
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
    properties: {
        id: {
            type: types.num, label: 'id'
        },
        shortNameNL: {
            type: types.str, label: 'naam (NL)', validation: {maxLength: 100},
        },
        shortNameEN: {
            type: types.str, label: 'naam (EN)', validation: {maxLength: 100},
        },
        alpha2Code: {
            type: types.str, label: 'alfa 2 code', validation: {maxLength: 2},
        },
        alpha3Code: {
            type: types.str, label: 'alfa 3 code', validation: {maxLength: 3},
        },
        numericCode: {
            type: types.str, label: 'numerieke code', validation: {maxLength: 3},
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
    properties: {
        id: {
            type: types.num, label: 'id',
        },
        alpha2Code: {
            type: types.str, label: 'Alfa 2 code', validation: {maxLength: 2},
            details: 'country',
        },
        subdivisionCode: {
            type: types.str, label: 'Code', validation: {maxLength: 3},
        },
        name: {
            type: types.str, label: 'Naam', validation: {maxLength: 150},
        },
        type: {
            type: types.str, label: 'Type', validation: {maxLength: 100},
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
    properties: {
        id: {
            type: types.num, label: 'id',
        },
        change: {
            type: types.str, label: 'change', validation: {maxLength: 3},
        },
        alpha2Code: {
            type: types.str, label: 'alfa 2 code', validation: {maxLength: 2}, details: 'country',
        },
        locationCode: {
            type: types.str, label: 'locatie code', validation: {maxLength: 3},
        },
        nameDiacritics: {
            type: types.str, label: 'naam (met accenttekens)', validation: {maxLength: 80},
        },
        nameWoDiacritics: {
            type: types.str, label: 'naam (zonder accenttekens)', validation: {maxLength: 80},
        },
        subdivisionCode: {
            type: types.str, label: 'deelsectorcode', validation: {maxLength: 3},
            details: 'subdivision', requires: ['alpha2Code'],
        },
        functionClassifier: {
            type: types.str, label: 'functie classificatie', validation: {maxLength: 8}, details: 'transform',
        },
        status: {
            type: types.str, label: 'status', validation: {maxLength: 2}, details: 'transform',
        },
        updateYear: {
            type: types.str, label: 'Jaartal update', validation: {maxLength: 4},
        },
        iata: {
            type: types.str, label: 'IATA', validation: {maxLength: 10},
        },
        coordinates: {
            type: types.str, label: 'coördinaten', validation: {maxLength: 15},
        },
        remarks: {
            type: types.str, label: 'opmerkingen', validation: {maxLength: 100},
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
    properties: {
        id: {
            type: types.num, label: 'id',
        },
        address1: {
            type: types.str, label: 'adres1', validation: {maxLength: 200},
        },
        address2: {
            type: types.str, label: 'adres2', validation: {maxLength: 200},
        },
        city: {
            type: types.str, label: 'plaats', validation: {maxLength: 100},
        },
        postalCode: {
            type: types.str, label: 'postcode', validation: {maxLength: 20},
        },
        country: {
            type: types.obj, label: 'land', target: 'country', hasNull: true, isMulti: false,
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
    properties: {
        id: {
            type: types.num, label: 'id', readOnly: true,
        },
        nameNL: {
            type: types.str, label: 'naam (NL)', validation: {maxLength: 100},
        },
        nameEN: {
            type: types.str, label: 'naam (EN)', validation: {maxLength: 100},
        },
        descNL: {
            type: types.str, label: 'beschrijving (NL)', validation: {maxLength: 1000},
        },
        descEN: {
            type: types.str, label: 'beschrijving (EN)', validation: {maxLength: 1000},
        },
        tonnageMin: {
            type: types.num, label: 'tonnage (ondergrens)', validation: {
                min: {value: 0, message: 'Negatief tonnage niet toegestaan.'},
            },
        },
        tonnageMax: {
            type: types.num, label: 'tonnage (bovengrens)', validation: {
                min: {value: 0, message: 'Negatief tonnage niet toegestaan.'},
            },
        },
        length: {
            type: types.num, label: 'lengte', validation: {
                min: {value: 0, message: 'Negatieve lengte niet toegestaan.'},
            },
        },
        beam: {
            type: types.num, label: 'breedte', validation: {
                min: {value: 0, message: 'Negatieve breedte niet toegestaan.'},
            },
        },
        height: {
            type: types.num, label: 'hoogte', validation: {
                min: {value: 0, message: 'Negatieve hoogte niet toegestaan.'},
            },
        },
        draft: {
            type: types.num, label: 'diepgang', validation: {
                min: {value: 0, message: 'Negatieve diepgang niet toegestaan.'},
            },
        },
        superType: {
            type: types.obj, label: 'supertype', target: 'vesselType',
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
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        hullNumber: {
            type: types.str, label: 'rompnummer', validation: {maxLength: 20},
        },
        constructionDate: {type: types.date, label: 'bouwdatum',},
        builder: {
            type: types.str, label: 'scheepswerf', validation: {maxLength: 255},
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
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        hull: {type: types.obj, hasNull: true, isMulti: false,},
        name: {type: types.str, label: 'naam', validation: {maxLength: 100},},
        image: {type: types.img, label: 'afbeelding', target: 'image'},
        mmsi: {type: types.str, label: 'mmsi', validation: {maxLength: 10},},
        callSign: {type: types.str, label: 'roepletters', validation: {maxLength: 10},},
        vesselType: {
            // type: types.obj, label: 'romp', target: 'vesselType',
            type: types.obj, hasNull: true, isMulti: false,
        },
        homePort: {
            type: types.obj, label: 'thuishaven', target: 'unLocode', hasNull: true, isMulti: false,
        },
        length: {
            type: types.num, label: "lengte", validation: {
                min: {value: 0, message: 'Negatieve lengte niet toegestaan.'},
            },
        },
        beam: {
            type: types.num, label: "breedte", validation: {
                min: {value: 0, message: 'Negatieve breedte niet toegestaan.'},
            },
        },
        draft: {
            type: types.num, label: "diepgang", validation: {
                min: {value: 0, message: 'Negatieve diepgang niet toegestaan.'},
            },
        },
        displacement: {
            type: types.num, label: "waterverplaatsing", validation: {
                min: {value: 0, message: 'Negatieve waterverplaatsing niet toegestaan.'},
            },
        },
        startDate: {type: types.date, label: "startdatum", validation: {},},
        endDate: {
            type: types.date, label: "einddatum", validation: {},
            crossField: {
                field: "startDate",
                validate: (thisField, thatField) => +thisField > +thatField,
                message: 'De einddatum mag niet voor de startdatum liggen',
            },
        },
        // https://www.carlrippon.com/react-hook-form-cross-field-validation/
        // validate: () => crossField.validate(getValues(endDateFieldName), getValues(startDateFieldName))
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
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        shortName: {type: types.str, label: 'naam', validation: {maxLength: 50},},
        longName: {type: types.str, label: 'volledige naam', validation: {maxLength: 200},},
        description: {type: types.str, label: 'beschrijving', validation: {maxLength: 1000},},
        url: {type: types.str, subtype: subtypes.url, label: 'url', validation: {maxLength: 2000},},
        email: {type: types.str, subtype: subtypes.email, label: 'email', validation: {maxLength: 320},},
        address: {type: types.obj, hasNull: true, isMulti: false,},
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
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        organisation1: {
            type: types.obj, label: 'organisatie 1', target: 'organisation',
            hasNull: false, isMulti: false, validation: {required: true,}
        },
        relationType: {type: types.obj, hasNull: true, isMulti: false,},
        organisation2: {
            type: types.obj, label: 'organisatie 2', target: 'organisation',
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
    label: 'soort relatie',
    endpoint: '/relationtypes',
    id: ['id'],
    hasBulkLoading: true,
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        nameNL: {type: types.str, label: 'naam (nl)', validation: {maxLength: 100},},
        nameEN: {type: types.str, label: 'naam (en)', validation: {maxLength: 100},},
        descNL: {type: types.str, label: 'beschrijving (nl)', validation: {maxLength: 1000},},
        descEN: {type: types.str, label: 'beschrijving (en)', validation: {maxLength: 1000},},
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
    id: ['id'],
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        fileName: {type: types.str, label: 'bestandsnaam', validation: {maxLength: 259},},
        fileType: {type: types.str, label: 'bestandstype', validation: {maxLength: 20},},
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
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        fullSizeId: {type: types.file, label: 'volledig', target: 'file', },
        thumbnailId: {type: types.file, label: 'miniatuur', target: 'file', noEdit: true,},
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
    properties: {
        id: {
            type: types.num, label: 'id', readOnly: true,
        },
        nameNL: {
            type: types.str, label: 'naam (NL)', validation: {maxLength: 100},
        },
        nameEN: {
            type: types.str, label: 'naam (EN)', validation: {maxLength: 100},
        },
        descNL: {
            type: types.str, label: 'beschrijving (NL)', validation: {maxLength: 1000},
        },
        descEN: {
            type: types.str, label: 'beschrijving (EN)', validation: {maxLength: 1000},
        },
        superType: {
            type: types.obj, label: 'supertype', target: 'propulsionType',
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

export function getSummaryProp(entityType, element) {
    const parts = element.split('.');
    const prop = entityType.properties[parts[0]];
    if (prop.type === types.obj) {
        return entityTypes[prop.target].properties[parts[1]];
    }
    return prop;
}

export function initializeAndCheckEntityTypes() {
    let typos = '';
    for (const entityName in entityTypes) {
        const entityType = entityTypes[entityName];
        entityType.name = entityName;
        typos += initializeAndCheckProperties(entityType, entityName);
        typos += checkSummaries(entityType);
    }
    if (typos === '') {
        console.log('✔ entityTypes appears to have no typos.');
    } else {
        console.error('❌ entityTypes has typos:\n' + typos);
    }
}

function checkProperties(entityType, entityName) {
    let typos = '';
    for (const [propName, property] of Object.entries(entityType.properties)) {
        switch (property.type) {
            case types.obj:
            case types.file:
                typos += checkInternalReference(entityName, propName, property);
                break;
            case types.str:
                typos += checkStringValidation(entityName, propName, property);
                break;
            default:
        }
    }
    return typos;
}

function initializeAndCheckProperties(entityType, entityName) {
    let typos = '';
    for (const [propName, property] of Object.entries(entityType.properties)) {
        switch (property.type) {
            case types.obj:
            case types.file:
                typos += checkAndSetInternalReference(entityName, propName, property);
                break;
            case types.str:
                typos += checkStringValidation(entityName, propName, property);
                expandAllValidations(property);
                break;
            case types.num:
                expandAllValidations(property);
                break;
            default:
                // expandAllValidations(property);
        }
    }
    return typos;
}

function checkInternalReference(entityName, propName, prop) {
    let typos = '';
    if (!prop.target) {
        if (!(propName in entityTypes)) {
            typos += `\t❌ #1 in ${entityName}.properties : '${propName}'\n`;
        }
    } else {
        if (!(prop.target in entityTypes)) {
            typos += `\t❌ #2 in ${entityName}.properties.${propName}.target : '${prop.target}'\n`;
        }
    }
    return typos;
}

function checkAndSetInternalReference(entityName, propName, prop) {
    let typos = '';
    if (!prop.target) {
        if (propName in entityTypes) {
            prop.target = propName;
            if (!prop.label) {
                prop.label = entityTypes[propName].label.toLowerCase();
            }
        } else {
            typos += `\t❌ #1 in ${entityName}.properties : '${propName}'\n`;
        }
    } else {
        if (prop.target in entityTypes) {
            if (!prop.label) {
                prop.label = entityTypes[prop.target].label.toLowerCase();
            }
        } else {
            typos += `\t❌ #2 in ${entityName}.properties.${propName}.target : '${prop.target}'\n`;
        }
    }
    return typos;
}

function checkStringValidation(entitiesKey, propName, prop) {
    let typos = '';
    if (!prop.validation) {
        typos += `\t❌ missing validation in ${entitiesKey}.properties.${propName}\n`;
    } else if (!prop.validation.maxLength) {
        typos += `\t❌ missing maxLength in ${entitiesKey}.properties.${propName}.validation\n`;
    }
    return typos;
}

function checkSummaries(entityType) {
    let typos = '';
    for (const summaryElement of entityType.summary) {
        const parts = summaryElement.split('.');
        const singlePartTypo = (parts.length === 1 && !entityType.properties[summaryElement]);
        let dualPartsTypo = false;
        if (parts.length === 2) {
            const targetEntityName = entityType.properties[parts[0]].target;
            dualPartsTypo = !entityTypes[targetEntityName]?.properties[parts[1]];
            // logv('❗ entityTypes.js » checkSummaries', {entityType, parts});
        }
        if (singlePartTypo || dualPartsTypo || parts.length > 2) {
            typos += `\t❌ #3 in ${entityType.name}.summary : '${summaryElement}'\n`;
        }
    }
    return typos;
}

function expandAllValidations(property) {
    if (!property?.validation) return;
    property.validation = transformEntries(property.validation, expandValidation);
}

function expandValidation([criterion, value]) {
    // const logPath = pathMkr(logRoot, expandValidation);
    // logv(logPath, {criterion, value});
    if (value !== null && typeof value === 'object') return [criterion, value];
    return [criterion, expansions[criterion](value)];
}

const expansions = {
    required: (value) => ({value, message: 'verplicht veld'}),
    maxLength: (value) => ({value, message: `maximaal ${value} karakters`}),
    minLength: (value) => ({value, message: `minimaal ${value} karakters`}),
    max: (value) => ({value, message: `niet groter dan ${value}`}),
    min: (value) => ({value, message: `niet kleiner dan ${value}`}),
};

function transformEntries(obj, callback) {
    return Object.fromEntries(Object.entries(obj).map(callback));
}

export function createEmptyItem(entityType) {
    // const logPath = pathMkr(logRoot, createEmptyItem, '(↓)');
    // logv(logPath, {entityName: entityType.name});
    // logv(null, {emptyObject});
    return createEmptyObject(entityType, Object.keys(entityType.properties));
}

export function createEmptySummary(entityType) {
    // const logPath = pathMkr(logRoot, createEmptySummary, '(↓)');
    // logv(logPath, {entityName: entityType.name});
    // logv(null, {emptyObject});
    return createEmptyObject(entityType, entityType.summary);
}

function createEmptyObject(entityType, propNames) {
    // const logPath = pathMkr(logRoot, createEmptyObject, '(↓, ↓)');
    // logv(logPath, {entityName: entityType.name, propNames});
    const item = {};
    propNames.forEach(key => {
        const prop = getSummaryProp(entityType, key);
        // logv(null, {key, prop});
        switch (prop?.type) {
            case types.str:
                item[key] = '';
                break;
            default:
                item[key] = null;
        }
    })
    return item;
}

export const entityNameList = Object.keys(entityTypes);
export const entityNames = Object.fromEntries(entityNameList.map(name => [name, name]));

export const exportedForTesting = {
    initializeAndCheckEntityTypes,
    checkAndSetInternalReference,
    checkStringValidation,
    checkSummaries,
    expandAllValidations,
    expandValidation, // ✔
    expansions, // ✔
    transformEntries, // ✔
    createEmptyObject
}
