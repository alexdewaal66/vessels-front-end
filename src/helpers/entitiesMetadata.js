import { logv } from '../dev/log';

export const entitiesMetadata = {};
const logRoot = 'entitiesMetadata';

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

entitiesMetadata.xyz = {
    label: 'Xyz',
    endpoint: '/xyzs',
    id: ['id'],
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        name: {
            type: types.str, label: 'naam', validation: {maxLength: 20},
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
            },
        },
        zyx: {
            type: types.obj,
            // multiple: true,
        },
    },
    summary: ['id', 'name', 'xyzString', 'ratio'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entitiesMetadata.zyx = {
    label: 'Zyx',
    endpoint: '/zyxs',
    id: ['id'],
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

entitiesMetadata.user = {
    label: 'Gebruiker',
    endpoint: '/users',
    id: ['username'],
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
            label: 'machtigingen', type: types.obj, target: 'authority'
        },
    },
    summary: ['id', 'email'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};
Object.defineProperty(entitiesMetadata.user.properties, 'id',{
    enumerable: true,
    get() {
        return this.username;
    }
});

entitiesMetadata.authority = {
    label: 'Machtiging',
    endpoint: '/users/{username}/authorities',
    id: ['username', 'role'],
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

entitiesMetadata.country = {
    label: 'Land',
    endpoint: '/countries',
    id: ['id'],
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

entitiesMetadata.subdivision = {
    label: 'Deelsector',
    endpoint: '/subdivisions',
    id: ['id'],
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

entitiesMetadata.unLocode = {
    label: 'Locatiecode',
    endpoint: '/un_locode',
    id: ['id'],
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

entitiesMetadata.address = {
    label: 'Adres',
    endpoint: '/addresses',
    id: ['id'],
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
            type: types.obj, label: 'land', target: 'country',
        },
    },
    methods: 'CRUD',
    summary: ['id', 'address1', 'address2', 'city', 'country.alpha2Code'],
    findItem: {
        endpoint: '/find',
        params: {},
    },
}


entitiesMetadata.vesselType = {
    label: 'Scheepstype',
    endpoint: '/vesseltypes',
    id: ['id'],
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
        },
    },
    methods: 'CRUD',
    summary: ['id', 'nameNL', 'nameEN'],
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entitiesMetadata.hull = {
    label: 'Romp',
    endpoint: '/hulls',
    id: ['id'],
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

entitiesMetadata.vessel = {
    label: 'Vaartuig',
    endpoint: '/vessels',
    id: ['id'],
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        hull: {type: types.obj,},
        name: {type: types.str, label: 'naam', validation: {maxLength: 100},},
        image: {type: types.img, label: 'afbeelding', target: 'image'},
        mmsi: {type: types.str, label: 'mmsi', validation: {maxLength: 10},},
        callSign: {type: types.str, label: 'roepletters', validation: {maxLength: 10},},
        vesselType: {
            // type: types.obj, label: 'romp', target: 'vesselType',
            type: types.obj,
        },
        homePort: {type: types.obj, label: 'thuishaven', target: 'unLocode',},
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

entitiesMetadata.organisation = {
    label: 'Organisatie',
    endpoint: '/organisations',
    id: ['id'],
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        shortName: {type: types.str, label: 'naam', validation: {maxLength: 50},},
        longName: {type: types.str, label: 'volledige naam', validation: {maxLength: 200},},
        description: {type: types.str, label: 'beschrijving', validation: {maxLength: 1000},},
        url: {type: types.str, subtype: subtypes.url, label: 'url', validation: {maxLength: 2000},},
        email: {type: types.str, subtype: subtypes.email, label: 'email', validation: {maxLength: 320},},
        address: {type: types.obj,},
    },
    methods: 'CRUD',
    summary: ['id', 'shortName'],
    findItem: {
        endpoint: '/find',
        params: {}
    }
};

entitiesMetadata.relation = {
    label: 'Relatie',
    endpoint: '/relations',
    id: ['id'],
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        organisation1: {type: types.obj, label: 'organisatie 1', target: 'organisation'},
        relationType: {type: types.obj},
        organisation2: {type: types.obj, label: 'organisatie 2', target: 'organisation'},
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

entitiesMetadata.relationType = {
    label: 'soort relatie',
    endpoint: '/relationtypes',
    id: ['id'],
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

entitiesMetadata.file = {
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

entitiesMetadata.image = {
    label: 'afbeelding',
    endpoint: '/images',
    id: ['id'],
    properties: {
        id: {type: types.num, label: 'id', readOnly: true,},
        fullSizeId: {type: types.file, label: 'volledig', target: 'file',},
        thumbnailId: {type: types.file, label: 'postzegel', target: 'file', readOnly: true,},
    },
    summary: ['id', 'thumbnailId'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

export function getSummaryProp(metadata, element) {
    const parts = element.split('.');
    const prop = metadata.properties[parts[0]];
    if (prop.type === types.obj) {
        return entitiesMetadata[prop.target].properties[parts[1]];
    }
    return prop;
}

export function initializeEntitiesMetadata() {
    let typos = '';
    for (const entitiesKey in entitiesMetadata) {
        const entity = entitiesMetadata[entitiesKey];
        entity.name = entitiesKey;
        typos = checkProperties(entity, typos);
        typos = checkSummaries(entity, typos);
    }
    if (typos === '') {
        console.log('✔ entitiesMetadata appears to have no typos.');
    } else {
        console.error('❌ entitiesMetadata has typos:\n' + typos);
    }
}

function checkProperties(entity, typos) {
    for (const propName in entity.properties) {
        if (entity.properties.hasOwnProperty(propName)) {
            const prop = entity.properties[propName];
            switch (prop.type) {
                case types.obj:
                    typos = checkInternalReference(entity.name, propName, prop, typos);
                    break;
                case types.str:
                    typos = checkStringValidation(entity.name, propName, prop, typos);
                    break;
            }
        } else {
            typos += `\t❌ in ${entity.name}.properties : '${propName}'\n`;
        }
    }
    return typos;
}

function checkInternalReference(entityName, propName, prop, typos) {
    if (!prop.target) {
        if (entitiesMetadata.hasOwnProperty(propName)) {
            prop.target = propName;
            if (!prop.label) {
                // logical or assignment '||=' results in 'Error: Module parse failed: Unexpected token'
                prop.label = entitiesMetadata[propName].label.toLowerCase();
            }
        } else {
            typos += `\t❌ in ${entityName}.properties : '${propName}'\n`;
        }
    } else {
        if (entitiesMetadata.hasOwnProperty(prop.target)) {
            if (!prop.label) {
                prop.label = entitiesMetadata[prop.target].label.toLowerCase();
            }
        } else {
            typos += `\t❌ in ${entityName}.properties.${propName}.target : '${prop.target}'\n`;
        }
    }
    return typos;
}

function checkStringValidation(entitiesKey, propName, prop, typos) {
    if (!prop.validation) {
        typos += `\t❌ missing validation in ${entitiesKey}.properties.${propName}\n`;
    } else if (!prop.validation.maxLength) {
        typos += `\t❌ missing maxLength in ${entitiesKey}.properties.${propName}.validation\n`;
    }
    return typos;
}

function checkSummaries(entity, typos) {
    for (const summaryElement of entity.summary) {
        const parts = summaryElement.split('.');
        const singlePartTypo = (parts.length === 1 && !entity.properties[summaryElement]);
        let dualPartsTypo = false;
        if (parts.length === 2) {
            const targetEntityName = entity.properties[parts[0]].target;
            dualPartsTypo = !entitiesMetadata[targetEntityName]?.properties[parts[1]];
            // logv('❗ entitiesMetadata.js » checkSummaries', {entity, parts});
        }
        if (singlePartTypo || dualPartsTypo || parts.length > 2) {
            typos += `\t❌ in ${entity.name}.summary : '${summaryElement}'\n`;
        }
    }
    return typos;
}


export function createEmptyItem(metadata) {
    const logPath = `${logRoot} » ${createEmptyItem.name}(↓)`;
    // logv(logPath, {metadata_name: metadata.name});
    const emptyObject = createEmptyObject(metadata, Object.keys(metadata.properties));
    // logv(null, {emptyObject});
    return emptyObject;
}

export function createEmptySummary(metadata) {
    const logPath = `${logRoot} » ${createEmptySummary.name}(↓)`;
    // logv(logPath, {metadata_name: metadata.name});
    const emptyObject = createEmptyObject(metadata, metadata.summary);
    // logv(null, {emptyObject});
    return emptyObject;
}

function createEmptyObject(metadata, propNames) {
    const logPath = `❗❗ ${logRoot} » ${createEmptyObject.name}(↓, ↓)`;
    // logv(logPath, {e_type: metadata.name, propNames});
    const item = {};
    propNames.forEach(key => {
        const prop = getSummaryProp(metadata, key);
        // logv(null, {key, prop});
        switch (prop?.type) {
            // case types.num:
            //     item[key] = 0;
            //     break;
            case types.str:
                item[key] = '';
                break;
            default:
                item[key] = null;
        }
    })
    return item;
}

