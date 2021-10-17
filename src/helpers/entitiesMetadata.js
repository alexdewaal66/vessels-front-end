export const entitiesMetadata = {};

export const types = {
    str: 'string',
    num: 'number',
    bool: 'boolean',
    img: 'image',
    arr: 'array',
    obj: 'object',
    date: 'date'
};

export const subtypes = {
    password: 'password',
    email: 'email',
    date: 'date',
    url: 'url',
    color: 'color',
    datetimeLocal: 'datetimeLocal',
    file: 'file',
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
        id: {
            type: types.num, label: 'id', readOnly: true,
        },
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
    multiple: true,
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
                required: true, validation: {maxLength: 256},
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
    summary: ['username', 'email'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entitiesMetadata.authority = {
    label: 'Machtiging',
    endpoint: '/users/{username}/authorities',
    id: ['username', 'role'],
    properties: {
        username: {
            type: types.str, label: 'username'
        },
        role: {
            type: types.str, label: 'rol'
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
            type: types.str, label: 'status', validation: {maxLength: 2},
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
            type: types.obj, label: 'land',
        },
    },
    methods: 'CRUD',
    summary: ['id', 'address1', 'city', 'country.alpha2Code'],
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
        builder: {type: types.str, label: 'scheepswerf',}
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
    summary: ['id', 'name'],
    findItem: {
        endpoint: '/find',
        params: {}
    }
};

export function initializeEntitiesMetadata() {
    let typos = '';
    for (const entitiesKey in entitiesMetadata) {
        const entity = entitiesMetadata[entitiesKey];
        for (const propName in entity.properties) {
            if (entity.properties.hasOwnProperty(propName)) {
                const prop = entity.properties[propName];
                if (prop.type === types.obj) {
                    if (!prop.target) {
                        if (entitiesMetadata.hasOwnProperty(propName)) {
                            prop.target = propName;
                            prop.label = entitiesMetadata[propName].label.toLowerCase();
                        } else {
                            typos += `\t❌ in ${entitiesKey}.properties : '${propName}'\n`;
                        }
                    } else {
                        if (entitiesMetadata.hasOwnProperty(prop.target)) {
                            prop.label = entitiesMetadata[prop.target].label.toLowerCase();
                        } else {
                            typos += `\t❌ in ${entitiesKey}.properties.${propName}.target : '${prop.target}'\n`;
                        }
                    }
                }
            } else {
                typos += `\t❌ in ${entitiesKey}.properties : '${propName}'\n`;
            }
        }
        entity.name = entitiesKey;
        for (const summaryElement of entity.summary) {
            if (!entity.properties[summaryElement]) {
                typos += `\t❌ in ${entitiesKey}.summary : '${summaryElement}'\n`;
            }
        }
    }
    if (typos === '') {
        console.log('✔ entitiesMetadata appears to have no typos.');
    } else {
        console.log('❌ entitiesMetadata has typos:\n' + typos);
    }
}

export function createEmptyItem(metadata) {
    // console.log(`entitiesMetadata » createEmptyItem() \n\t metadata.name=`, metadata.name);
    const item = {};
    Object.keys(metadata.properties).forEach(key => {
        switch (metadata.properties[key].type) {
            case types.num:
                item[key] = 0;
                break;
            case types.str:
                item[key] = '';
                break;
            default:
                item[key] = null;
        }
    })
    return item;
}

/*


 */