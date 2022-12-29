import { logCondition, logv, pathMkr } from '../../dev/log';
import { quantityNames } from '../../components/UnitInput';
import { authorities } from './levels';

const logRoot = 'entityTypes.js';

export const hiddenProps = ['timestamp', 'owner', 'updater'];

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

export const referringFieldTypes = [fieldTypes.img, fieldTypes.arr, fieldTypes.obj];//, fieldTypes.file];

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

entityTypes.xyz = {
    label: 'Xyz',
    endpoint: '/xyzs',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        name: {type: fieldTypes.str, label: {NL: 'naam', EN: 'name'}, validation: {required: true, maxLength: 20},},
        description: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving', EN: 'description'},
            validation: {maxLength: 1000}
        },
        xyzString: {type: fieldTypes.str, validation: {maxLength: 200},},
        ratio: {
            type: fieldTypes.num, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatief ratio niet toegestaan', EN: 'negative ratio forbidden'}
                },
            },
        },
        zyx: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        image: {type: fieldTypes.img, label: {NL: 'afbeelding', EN: 'image'}, target: 'image'},
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
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        name: {
            type: fieldTypes.str, label: {NL: 'naam', EN: 'name'}, validation: {maxLength: 100},
        },
        description: {
            type: fieldTypes.str, label: {NL: 'beschrijving', EN: 'description'}, validation: {maxLength: 1000}
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
    label: {NL: 'Gebruiker', EN: 'User'},
    endpoint: '/users',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        username: {
            label: {NL: 'gebruikersnaam', EN: 'username'}, type: fieldTypes.str,
            validation: {required: true, maxLength: 256},
        },
        roles: {
            access: {
                read: authorities.USER, create: authorities.ROLE_DEMIURG,
                update: authorities.ROLE_ADMIN, delete: authorities.ROLE_DEMIURG,
                forbidden: {update: authorities.SELF},
            },
            type: fieldTypes.arr, target: 'role', label: {NL: 'rollen', EN: 'roles'},
            hasNull: false, isMulti: true, validation: {required: true,}
        },
        email: {
            access: [authorities.ROLE_ADMIN, authorities.SELF],
            label: 'email', type: fieldTypes.str, subtype: subtypes.email,
            validation: {required: true, maxLength: 254},
        },
        password: {
            access: authorities.SELF,
            label: {NL: 'wachtwoord', EN: 'password'}, type: fieldTypes.str, validation: {
                required: true, maxLength: 256,
            }
        },
        enabled: {
            access: authorities.ROLE_ADMIN,
            label: {NL: 'ingeschakeld', EN: 'enabled'}, type: fieldTypes.bool,
        },
        apikey: {
            access: [authorities.ROLE_ADMIN, authorities.SELF],
            label: 'apikey', type: fieldTypes.str, validation: {maxLength: 256},
        },
    },
    summary: ['id', 'username'],
    methods: 'CRUD',
    access: {
        read: authorities.USER, create: authorities.ROLE_ADMIN,
        update: [authorities.ROLE_ADMIN, authorities.SELF], delete: authorities.ROLE_ADMIN,
    },
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.role = {
    label: {NL: 'Rol', EN: 'Role'},
    endpoint: '/roles',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        name: {
            type: fieldTypes.str, label: {NL: 'rol', EN: 'role'}, validation: {required: true, maxLength: 100},
        },
    },
    summary: ['id', 'name'],
    methods: 'CRUD',
    access: authorities.ROLE_ADMIN,
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.country = {
    label: {NL: 'Land', EN: 'Country'},
    endpoint: '/countries',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        shortNameNL: {
            type: fieldTypes.str, label: {NL: 'naam (NL)', EN: 'name (NL)'}, validation: {maxLength: 100},
        },
        shortNameEN: {
            type: fieldTypes.str, label: {NL: 'naam (EN)', EN: 'name (EN)'}, validation: {maxLength: 100},
        },
        alpha2Code: {
            type: fieldTypes.str, label: {NL: 'alfa 2 code', EN: 'alpha 2 code'}, validation: {maxLength: 2},
        },
        alpha3Code: {
            type: fieldTypes.str, label: {NL: 'alfa 3 code', EN: 'alpha 3 code'}, validation: {maxLength: 3},
        },
        numericCode: {
            type: fieldTypes.str, label: {NL: 'numerieke code', EN: 'numeric code'}, validation: {maxLength: 3},
        },
    },
    summary: ['id', 'shortNameNL', 'alpha2Code', 'alpha3Code'],
    sumAlt: ['id', {NL: 'shortNameNL', EN: 'shortNameEN'}, 'alpha2Code', 'alpha3Code'],
    sumObj: {
        id: 'id',
        shortName: {NL: 'shortNameNL', EN: 'shortNameEN'},
        alpha2Code: 'alpha2Code', alpha3Code: 'alpha3Code',
    },
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
    },
};

entityTypes.subdivision = {
    label: {NL: 'Deelsector', EN: 'Subdivision'},
    endpoint: '/subdivisions',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        alpha2Code: {
            type: fieldTypes.str, label: {NL: 'Alfa 2 code', EN: 'Alpha 2 code'}, validation: {maxLength: 2},
            details: 'country',
        },
        subdivisionCode: {
            type: fieldTypes.str, label: 'Code', validation: {maxLength: 3},
        },
        name: {
            type: fieldTypes.str, label: {NL: 'Naam', EN: 'name'}, validation: {maxLength: 150},
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
    label: {NL: 'Locatiecode', EN: 'Location code'},
    endpoint: '/un_locode',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        change: {
            type: fieldTypes.str, label: {NL: 'wijziging', EN: 'change'}, validation: {maxLength: 3},
        },
        alpha2Code: {
            type: fieldTypes.str,
            label: {NL: 'alfa 2 code', EN: 'alpha 2 code'},
            validation: {maxLength: 2},
            details: 'country',
        },
        locationCode: {
            type: fieldTypes.str, label: {NL: 'locatie code', EN: 'location code'}, validation: {maxLength: 3},
        },
        nameDiacritics: {
            type: fieldTypes.str,
            label: {NL: 'naam (met accenttekens)', EN: 'name (with diacritics)'},
            validation: {maxLength: 80},
        },
        nameWoDiacritics: {
            type: fieldTypes.str,
            label: {NL: 'naam (zonder accenttekens)', EN: 'name (no diacritics)'},
            validation: {maxLength: 80},
        },
        subdivisionCode: {
            type: fieldTypes.str, label: {NL: 'deelsectorcode', EN: 'subdivision code'}, validation: {maxLength: 3},
            details: 'subdivision', requires: ['alpha2Code'],
        },
        functionClassifier: {
            type: fieldTypes.str,
            label: {NL: 'functie classificatie', EN: 'function classification'},
            validation: {maxLength: 8},
            details: 'transform',
        },
        status: {
            type: fieldTypes.str, label: 'status', validation: {maxLength: 2}, details: 'transform',
        },
        updateYear: {
            type: fieldTypes.str, label: {NL: 'Jaartal update', EN: 'Update year'}, validation: {maxLength: 4},
        },
        iata: {
            type: fieldTypes.str, label: 'IATA', validation: {maxLength: 10},
        },
        coordinates: {
            type: fieldTypes.str, label: {NL: 'coördinaten', EN: 'coordinates'}, validation: {maxLength: 15},
        },
        remarks: {
            type: fieldTypes.str, label: {NL: 'opmerkingen', EN: 'remarks'}, validation: {maxLength: 100},
        },
    },
    summary: ['id', 'alpha2Code', 'locationCode', 'nameWoDiacritics'],
    sumAlt: ['id', 'alpha2Code', 'locationCode', ['nameWODiacritics', 'nameDiacritics']],
    sumObj: {
        id: 'id', alpha2Code: 'alpha2Code', locationCode: 'locationCode',
        name: ['nameWODiacritics', 'nameDiacritics'],
    },
    methods: 'R',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.address = {
    label: {NL: 'Adres', EN: 'Address'},
    endpoint: '/addresses',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        address1: {
            type: fieldTypes.str, label: {NL: 'adres1', EN: 'address1'}, validation: {maxLength: 200},
        },
        address2: {
            type: fieldTypes.str, label: {NL: 'adres2', EN: 'address2'}, validation: {maxLength: 200},
        },
        city: {
            type: fieldTypes.str, label: {NL: 'plaats', EN: 'city'}, validation: {maxLength: 100},
        },
        postalCode: {
            type: fieldTypes.str, label: {NL: 'postcode', EN: 'postal code'}, validation: {maxLength: 20},
        },
        country: {
            type: fieldTypes.obj, hasNull: true, isMulti: false,
            //     label: {NL: 'land', EN: 'land'}, target: 'country',
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
    label: {NL: 'Scheepstype', EN: 'Ship type'},
    endpoint: '/vesseltypes',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        nameNL: {
            type: fieldTypes.str, label: {NL: 'naam (NL)', EN: 'name (NL)'}, validation: {maxLength: 100},
        },
        nameEN: {
            type: fieldTypes.str, label: {NL: 'naam (EN)', EN: 'name (EN)'}, validation: {maxLength: 100},
        },
        descNL: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving (NL)', EN: 'description (NL)'},
            validation: {maxLength: 1000},
        },
        descEN: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving (EN)', EN: 'description (EN)'},
            validation: {maxLength: 1000},
        },
        tonnageMin: {
            type: fieldTypes.num, label: {NL: 'tonnage (ondergrens)', EN: 'tonnage (lower boundary)'},
            validation: {
                // required: true,
                min: {
                    value: 0,
                    message: {NL: 'negatief tonnage niet toegestaan', EN: 'negative tonnage forbidden'}
                },
            },
            crossFieldChecks: [{
                name: 'min>max',
                otherFieldName: 'tonnageMax',
                validate: (thisField, otherField) => +thisField <= +otherField || !thisField || !otherField,
                message: 'TEXT:vesselType:tonnageMin:0',
                text: {NL: 'minimum is groter dan maximum', EN: 'minimum is larger than maximum'},
            }],
            quantity: quantityNames.displacement,
        },
        tonnageMax: {
            type: fieldTypes.num, label: {NL: 'tonnage (bovengrens)', EN: 'tonnage (upper boundary)'},
            validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatief tonnage niet toegestaan', EN: 'negative tonnage forbidden'}
                },
            },
            crossFieldChecks: [{
                name: 'max<min',
                otherFieldName: 'tonnageMin',
                validate: (thisField, otherField) => +thisField >= +otherField || !thisField || !otherField,
                message: 'TEXT:vesselType:tonnageMax:0',
                text: {NL: 'maximum is kleiner dan minimum', EN: 'maximum is smaller than minimum'},
            }],
            quantity: quantityNames.displacement,
        },
        lengthOA: {
            type: fieldTypes.num, label: {NL: 'lengte o.a.', EN: 'length o.a.'}, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatieve lengte niet toegestaan', EN: 'negative length forbidden'}
                },
            },
            quantity: quantityNames.length,
        },
        beam: {
            type: fieldTypes.num, label: {NL: 'breedte', EN: 'beam'}, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatieve breedte niet toegestaan', EN: 'negative beam forbidden'}
                },
            },
            quantity: quantityNames.length,
        },
        height: {
            type: fieldTypes.num, label: {NL: 'hoogte', EN: 'height'}, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatieve hoogte niet toegestaan', EN: 'negative height forbidden'}
                },
            },
            quantity: quantityNames.length,
        },
        draft: {
            type: fieldTypes.num, label: {NL: 'diepgang', EN: 'draft'}, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatieve diepgang niet toegestaan', EN: 'negative draft forbidden'}
                },
            },
            quantity: quantityNames.length,
        },
        superType: {
            type: fieldTypes.obj, label: 'supertype', target: 'vesselType',
            hasNull: false, isMulti: false,
            validation: {
                required: true,
                min: {
                    value: 1,
                    message: {NL: 'supertype verplicht', EN: 'supertype required'}
                },
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
    label: {NL: 'Romp', EN: 'Hull'},
    endpoint: '/hulls',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        hullNumber: {
            // type: fieldTypes.str, label: 'rompnummer', validation: {maxLength: 20},
            type: fieldTypes.str, label: {NL: 'rompnummer', EN: 'hull number'}, validation: {maxLength: 20},
        },
        constructionDate: {type: fieldTypes.date, label: {NL: 'bouwdatum', EN: 'build date'},},
        builder: {
            type: fieldTypes.str, label: {NL: 'scheepswerf', EN: 'construction yard'}, validation: {maxLength: 255},
        },
    },
    methods: 'CRUD',
    summary: ['id', 'hullNumber'],
    findItem: {
        endpoint: '/find',
        params: {}
    },
};

entityTypes.vessel = {
    label: {NL: 'Vaartuig', EN: 'Vessel'},
    endpoint: '/vessels',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        hull: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        name: {type: fieldTypes.str, label: {NL: 'naam', EN: 'name'}, validation: {maxLength: 100},},
        image: {type: fieldTypes.img,},
        mmsi: {type: fieldTypes.str, label: 'mmsi', validation: {maxLength: 10},},
        callSign: {type: fieldTypes.str, label: {NL: 'roepletters', EN: 'call sign'}, validation: {maxLength: 10},},
        vesselType: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        homePort: {
            type: fieldTypes.obj,
            label: {NL: 'thuishaven', EN: 'home port'},
            target: 'unLocode',
            hasNull: true,
            isMulti: false,
        },
        propulsionType: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        operations: {
            type: fieldTypes.arr, target: 'operation',
            hasNull: true, isMulti: true, readOnly: true,
        },
        lengthOA: {
            type: fieldTypes.num, label: {NL: 'lengte o.a.', EN: 'length o.a.'}, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatieve lengte niet toegestaan', EN: 'negative length forbidden'}
                },
            },
            quantity: quantityNames.length,
        },
        beam: {
            type: fieldTypes.num, label: {NL: 'breedte', EN: 'beam'}, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatieve breedte niet toegestaan', EN: 'negative beam forbidden'}
                },
                crossFieldChecks: [{
                    name: 'shape',
                    otherFieldName: 'lengthOA',
                    validate: (thisField, otherField) => +thisField < +otherField,
                    message: 'meer breedte dan lengte is waarschijnlijk fout',
                }],
            },
            quantity: quantityNames.length,
        },
        draft: {
            type: fieldTypes.num, label: {NL: 'diepgang', EN: 'draft'}, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatieve diepgang niet toegestaan', EN: 'negative draft forbidden'}
                },
            },
            quantity: quantityNames.length,
        },
        displacement: {
            type: fieldTypes.num, label: {NL: 'waterverplaatsing', EN: 'displacement'}, validation: {
                min: {
                    value: 0,
                    message: {NL: 'negatieve waterverplaatsing niet toegestaan', EN: 'negative displacement forbidden'}
                },
            },
            quantity: quantityNames.displacement,
        },
        startDate: {type: fieldTypes.date, label: {NL: 'startdatum', EN: 'start date'}, validation: {},},
        endDate: {
            type: fieldTypes.date, label: {NL: 'einddatum', EN: 'end date'}, validation: {},
            crossFieldChecks: [{
                name: 'sequence',
                otherFieldName: 'startDate',
                validate: (thisField, otherField) => +thisField >= +otherField || !thisField,
                message: 'De einddatum mag niet voor de startdatum liggen',
            }],
        },
        // https://www.carlrippon.com/react-hook-form-cross-field-validation/
        // validate: value => typeField.crossField.validate(value, getValues(startDateFieldName))
        description: {
            type: fieldTypes.str, label: {NL: 'beschrijving', EN: 'description'},
            validation: {maxLength: 5000},
        },

    },
    methods: 'CRUD',
    summary: ['id', 'name', 'image.thumbnailId'],
    findItem: {
        endpoint: '/find',
        params: {}
    },
};

entityTypes.organisation = {
    label: {NL: 'Organisatie', EN: 'Organisation'},
    endpoint: '/organisations',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        shortName: {type: fieldTypes.str, label: {NL: 'naam', EN: 'name'}, validation: {maxLength: 50},},
        longName: {
            type: fieldTypes.str,
            label: {NL: 'volledige naam', EN: 'long name'},
            validation: {maxLength: 200},
        },
        description: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving', EN: 'description'},
            validation: {maxLength: 1000},
        },
        url: {type: fieldTypes.str, subtype: subtypes.url, label: 'url', validation: {maxLength: 2000},},
        email: {type: fieldTypes.str, subtype: subtypes.email, label: 'email', validation: {maxLength: 320},},
        address: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        operations: {
            type: fieldTypes.arr, target: 'operation', hasNull: true, isMulti: true, readOnly: true,
        },
    },
    methods: 'CRUD',
    summary: ['id', 'shortName', 'longName'],
    findItem: {
        endpoint: '/find',
        params: {}
    },
};

entityTypes.relation = {
    label: {NL: 'Relatie', EN: 'Relation'},
    endpoint: '/relations',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        organisation1: {
            type: fieldTypes.obj, label: {NL: 'organisatie 1', EN: 'organisation 1'}, target: 'organisation',
            hasNull: false, isMulti: false, validation: {required: true,}
        },
        relationType: {type: fieldTypes.obj, hasNull: true, isMulti: false,},
        organisation2: {
            type: fieldTypes.obj, label: {NL: 'organisatie 2', EN: 'organisation 2'}, target: 'organisation',
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
    label: {NL: 'relatietype', EN: 'relation type'},
    endpoint: '/relationtypes',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        nameNL: {type: fieldTypes.str, label: {NL: 'naam (nl)', EN: 'name (NL)'}, validation: {maxLength: 100},},
        nameEN: {type: fieldTypes.str, label: {NL: 'naam (en)', EN: 'name (EN)'}, validation: {maxLength: 100},},
        descNL: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving (nl)', EN: 'description (NL)'},
            validation: {maxLength: 1000},
        },
        descEN: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving (en)', EN: 'description (en)'},
            validation: {maxLength: 1000},
        },
    },
    summary: ['id', 'nameNL', 'nameEN'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.file = {
    label: {NL: 'Bestand', EN: 'File'},
    endpoint: '/files',
    uploadEndpoint: '/files/upload',
    downloadEndpoint: (id) => `/files/${id}/download`,
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        fileName: {
            type: fieldTypes.str,
            label: {NL: 'bestandsnaam', EN: 'file name'},
            validation: {maxLength: 259},
        },
        fileType: {type: fieldTypes.str, label: {NL: 'bestandstype', EN: 'file type'}, validation: {maxLength: 20},},
    },
    summary: ['id', 'fileName', 'fileType'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.image = {
    label: {NL: 'afbeelding', EN: 'image'},
    endpoint: '/images',
    id: ['id'],
    needsReload: true,
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        fullSizeId: {type: fieldTypes.file, label: {NL: 'volledig', EN: 'full size'}, target: 'file',},
        thumbnailId: {
            type: fieldTypes.file,
            label: {NL: 'afbeelding', EN: 'image'},
            target: 'file',
            noEdit: true,
        },
    },
    summary: ['id', 'thumbnailId'],
    methods: 'CRUD',
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

entityTypes.propulsionType = {
    label: {NL: 'voortstuwing', EN: 'propulsion'},
    endpoint: '/propulsiontypes',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        nameNL: {
            type: fieldTypes.str, label: {NL: 'naam (NL)', EN: 'name (NL)'}, validation: {maxLength: 100},
        },
        nameEN: {
            type: fieldTypes.str, label: {NL: 'naam (EN)', EN: 'name (EN)'}, validation: {maxLength: 100},
        },
        descNL: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving (NL)', EN: 'description (NL)'},
            validation: {maxLength: 1000},
        },
        descEN: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving (EN)', EN: 'description (EN)'},
            validation: {maxLength: 1000},
        },
        superType: {
            type: fieldTypes.obj, label: 'supertype', target: 'propulsionType',
            hasNull: false, isMulti: false,
            validation: {
                required: true,
                min: {
                    value: 1,
                    message: {NL: 'supertype verplicht', EN: 'supertype required'}
                },
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

entityTypes.operation = {
    label: {NL: 'Beheer', EN: 'Management'},
    endpoint: '/operations',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        vessel: {type: fieldTypes.obj, hasNull: true, isMulti: false},
        operationType: {type: fieldTypes.obj, hasNull: true, isMulti: false},
        organisation: {type: fieldTypes.obj, hasNull: true, isMulti: false},
    },
    methods: 'CRUD',
    summary: [
        'id',
        'vessel.name', 'operationType.nameNL', 'organisation.shortName'],
    summaryLabel: {
        'vessel.name': {NL: 'vaartuig', EN: 'vessel'},
        'operationType.nameNL': {NL: 'beheerrol', EN: 'management role'},
        'organisation.shortName': {NL: 'organisatie', EN: 'organisation'},
    },
    findItem: {
        endpoint: '/find',
        params: {}
    },
};

entityTypes.operationType = {
    label: {NL: 'Beheerrol', EN: 'Management role'},
    endpoint: '/operationtypes',
    id: ['id'],
    fields: {
        id: {
            type: fieldTypes.num, label: 'id', readOnly: true,
            access: authorities.ROLE_ADMIN,
        },
        nameNL: {
            type: fieldTypes.str, label: {NL: 'naam (NL)', EN: 'name (NL)'}, validation: {maxLength: 100},
        },
        nameEN: {
            type: fieldTypes.str, label: {NL: 'naam (EN)', EN: 'name (EN)'}, validation: {maxLength: 100},
        },
        descNL: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving (NL)', EN: 'description (NL)'},
            validation: {maxLength: 1000},
        },
        descEN: {
            type: fieldTypes.str,
            label: {NL: 'beschrijving (EN)', EN: 'description (EN)'},
            validation: {maxLength: 1000},
        },
    },
    methods: 'CRUD',
    summary: [
        'id',
        'nameNL', 'nameEN'],
    findItem: {
        endpoint: '/find',
        params: {},
    },
};

export const entityNameList = Object.keys(entityTypes);

// logv(null, {entityNameList});

export function getTypeFieldFromPath(entityTypes, entityType, fieldPath) { // ✔✔
    const logPath = pathMkr(logRoot, getTypeFieldFromPath);
    const doLog = logCondition(getTypeFieldFromPath, entityType.name, fieldPath)
    // depends on presence of internal reference
    const parts = fieldPath.split('.');
    const directField = entityType.fields[parts[0]];
    if (doLog) logv(logPath, {entityType, fieldPath, parts, directField});
    if (referringFieldTypes.includes(directField.type)) {
        const targetField = entityTypes[directField.target].fields[parts[1]]
        if (doLog) logv(null, {targetField});
        return targetField;
    }
    return directField;
}

export function initializeEntityTypes(entityTypes) { // ✔✔
    for (const entityName in entityTypes) {
        const entityType = entityTypes[entityName];
        entityType.name = entityName;
        entityType.targets = [];
        setEveryFieldsInternalReferences(entityTypes, entityName);
        expandEveryFieldsValidations(entityTypes, entityName);
    }
    // logv(pathMkr(logRoot, initializeEntityTypes), {entityNameList});
}


function setEveryFieldsInternalReferences(entityTypes, entityName) { // ✔✔
    for (const [fieldName, field] of Object.entries(entityTypes[entityName].fields)) {
        if (referringFieldTypes.includes(field.type))
            setInternalReference(entityTypes, entityName, fieldName); // ✔✔
    }
}


function setInternalReference(entityTypes, entityName, fieldName) { // ✔✔
    // const logPath = pathMkr(logRoot, setInternalReference);
    const entityType = entityTypes[entityName];
    const typeField = entityType.fields[fieldName];
    if (!typeField.target) typeField.target = fieldName;
    if (typeField.target in entityTypes) {
        if (!typeField.label) {
            const targetLabel = entityTypes[typeField.target].label;
            if (typeof targetLabel === 'string')
                typeField.label = targetLabel.toLowerCase();
            else {
                typeField.label = {};
                for (const targetLabelKey in targetLabel) {
                    typeField.label[targetLabelKey] = targetLabel[targetLabelKey].toLowerCase();
                }
            }
        }
    }
    addToTargets(entityName, {fieldName, targetName: typeField.target});
    reorderEntityNames(entityName, typeField.target);
    // addToOwners(entityTypes[typeField.target], {fieldName, ownerName: entityName});
}

function addToTargets(entityName, targetDetails) {
    function hasEqualDetails(obj1, obj2) {
        return obj1.fieldName === obj2.fieldName && obj1.targetName === obj2.targetName;
    }

    const entityType = entityTypes[entityName];
    if (!entityType.targets) entityType.targets = [];
    if (!entityType.targets.some(e => hasEqualDetails(e, targetDetails)))
        entityType.targets.push(targetDetails);
}

function wrapAround(arr, lo, hi, count = 1) {
    const wrapped = arr.splice(hi, count);
    arr.splice(lo, 0, ...wrapped);
}

function reorderEntityNames(ownerName, targetName) {
    // const logPath = pathMkr(logRoot, reorderEntityNames, '↓↓')
    // const doLog = logCondition('entityTypes', ownerName, targetName);
    const ownerPos = entityNameList.indexOf(ownerName);
    const targetPos = entityNameList.indexOf(targetName);
    // if (doLog) logv(logPath, {ownerName, ownerPos, targetName, targetPos});
    if (ownerPos < targetPos) {//swap
        // const temp = entityNameList[ownerPos];
        // entityNameList[ownerPos] = entityNameList[targetPos];
        // entityNameList[targetPos] = temp;
        wrapAround(entityNameList, ownerPos, targetPos);
    }
}

function expandEveryFieldsValidations(entityTypes, entityName) { // ✔✔
    for (const field of Object.values(entityTypes[entityName].fields)) {
        // if (field.type === types.str || field.type === types.num)
        expandFieldValidation(field); // ✔✔
    }
    if (entityTypes[entityName].restrictedFields)
        for (const field of Object.values(entityTypes[entityName].restrictedFields)) {
            // if (field.type === types.str || field.type === types.num)
            expandFieldValidation(field); // ✔✔
        }
}

function expandFieldValidation(field) { // ✔✔
    if (!field?.validation) return;
    field.validation = transformEntries(field.validation, expandValidation);
}

function expandValidation([criterionKey, criterionValue]) { // ✔✔
    // const logPath = pathMkr(logRoot, expandValidation);
    // logv(logPath, {criterionKey, criterionValue});
    if (criterionValue !== null && typeof criterionValue === 'object') return [criterionKey, criterionValue];
    return [criterionKey, expansions[criterionKey](criterionValue)];
}

const expansions = { // ✔✔
    required: (value) => ({value, message: {NL: 'verplicht veld', EN: 'required field'}}),
    maxLength: (value) => ({
        value,
        message: {NL: `maximaal ${value} karakters`, EN: `${value} characters maximum`}
    }),
    minLength: (value) => ({
        value,
        message: {NL: `minimaal ${value} karakters`, EN: `${value} characters minimum`}
    }),
    max: (value) => ({
        value,
        message: {NL: `niet groter dan ${value}`, EN: `not larger than ${value}`}
    }),
    min: (value) => ({
        value,
        message: {NL: `niet kleiner dan ${value}`, EN: `not smaller than ${value}`}
    }),
};

export function transformEntries(obj, callback) { // ✔✔
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
    const emptyObject = createEmptyObject(entityTypes, entityType, entityType.summary);
    // logv(null, {emptyObject});
    return emptyObject;
}

function createEmptyObject(entityTypes, entityType, fieldPaths) { // ✔✔
    // depends on presence of internal references
    // const logPath = pathMkr(logRoot, createEmptyObject, '(↓, ↓)');
    // logv(logPath, {entityName: entityType.name, fieldPaths});
    const item = {};
    fieldPaths.forEach(fieldPath => {
        const field = getTypeFieldFromPath(entityTypes, entityType, fieldPath);
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

export const entityNames = Object.fromEntries(entityNameList.map(name => [name, name]));

export const exportedForTesting = {
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
