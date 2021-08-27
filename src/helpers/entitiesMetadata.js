import { types, subtypes } from './endpoints';

export const entitiesMetadata = {};

entitiesMetadata.xyz = {
    label: "Xyz",
    endpoint: "/xyzs",
    id: ["id"],
    properties: {
        id: {
            type: types.num, label: "id", readOnly: true,
        },
        name: {
            type: types.str, label: "naam", validation: {maxLength: 100},
        },
        description: {
            type: types.str, label: "beschrijving", validation: {maxLength: 1000}
        },
        xyzString: {
            type: types.str, validation: {maxLength: 200},
        },
        ratio: {
            type: types.num, validation: {
                min: {value: 0, message: "Negatief ratio niet toegestaan."},
            },
        },
        zyx: {
            type: types.obj, label: "zyx", target: "zyx",
        },
    },
    summary: ["id", "name", "xyzString", "ratio"],
    methods: "CRUD",
};

entitiesMetadata.zyx = {
    label: "Zyx",
    endpoint: "/zyxs",
    id: ["id"],
    properties: {
        id: {
            type: types.num, label: "id", readOnly: true,
        },
        name: {
            type: types.str, label: "naam", validation: {maxLength: 100},
        },
        description: {
            type: types.str, label: "beschrijving", validation: {maxLength: 1000}
        },
    },
    summary: ["id", "name"],
    methods: "CRUD",
};

entitiesMetadata.user = {
    label: "Gebruiker",
    endpoint: "/users",
    id: ["username"],
    properties: {
        username: {
            label: "username", type: types.str, readOnly: true, validation: {maxLength: 256},
        },
        password: {
            label: "password", type: types.str, validation: {
                required: true, validation: {maxLength: 256},
            }
        },
        enabled: {
            label: "enabled", type: types.bool
        },
        apikey: {
            label: "apikey", type: types.str, validation: {maxLength: 256},
        }
        ,
        email: {
            label: "email", type: types.str, subtype:subtypes.email, validation: {maxLength: 254},
        }
        ,
        authorities: {
            label: "machtigingen", type: types.obj, target: "authority"
        },
    },
    summary: ["username", "email"],
    methods: "CRUD",
};

entitiesMetadata.authority = {
    label: "Machtiging",
    endpoint: "/users/{username}/authorities",
    id: ["username", "authority"],
    properties: {
        username: {
            type: types.str, label: "username"
        },
        authority: {
            type: types.str, label: "authority"
        },
    },
    summary: ["username", "authority"],
    methods: "R",
};

entitiesMetadata.country = {
    label: "Land",
    endpoint: "/countries",
    id: ["id"],
    properties: {
        id: {
            type: types.num, label: "id"
        },
        shortNameNL: {
            type: types.str, label: "naam (NL)", validation: {maxLength: 100},
        },
        shortNameEN: {
            type: types.str, label: "naam (EN)", validation: {maxLength: 100},
        },
        alpha2Code: {
            type: types.str, label: "alfa 2 code", validation: {maxLength: 2},
        },
        alpha3Code: {
            type: types.str, label: "alfa 3 code", validation: {maxLength: 3},
        },
        numericCode: {
            type: types.str, label: "numerieke code", validation: {maxLength: 3},
        },
    },
    summary: ["id", "shortNameNL", "alpha2Code", "alpha3Code"],
    methods: "R",
};

entitiesMetadata.subdivision = {
    label: "Deelsector",
    endpoint: "/subdivisions",
    id: ["id"],
    properties: {
        id: {
            type: types.num, label: "id",
        },
        alpha2Code: {
            type: types.str, label: "Alfa 2 code", validation: {maxLength: 2},
        },
        code: {
            type: types.str, label: "Code", validation: {maxLength: 3},
        },
        name: {
            type: types.str, label: "Naam", validation: {maxLength: 150},
        },
        type: {
            type: types.str, label: "Type", validation: {maxLength: 100},
        },
    },
    summary: ["id", "name", "alpha2Code"],
    methods: "R",
};

entitiesMetadata.vesselType = {
    label: "Scheepstype",
    endpoint: "/vesseltypes",
    id: ["id"],
    properties: {
        id: {
            type: types.num, label: 'id', readOnly: true,
        },
        nameNL: {
            type: types.str, label: "naam (NL)", validation: {maxLength: 100},
        },
        nameEN: {
            type: types.str, label: "naam (EN)", validation: {maxLength: 100},
        },
        descNL: {
            type: types.str, label: "beschrijving (NL)", validation: {maxLength: 1000},
        },
        descEN: {
            type: types.str, label: "beschrijving (EN)", validation: {maxLength: 1000},
        },
        tonnageMin: {
            type: types.num, label: "tonnage (ondergrens)", validation: {
                min: {value: 0, message: "Negatief tonnage niet toegestaan."},
            },
        },
        tonnageMax: {
            type: types.num, label: "tonnage (bovengrens)", validation: {
                min: {value: 0, message: "Negatief tonnage niet toegestaan."},
            },
        },
        length: {
            type: types.num, label: "lengte", validation: {
                min: {value: 0, message: "Negatieve lengte niet toegestaan."},
            },
        },
        beam: {
            type: types.num, label: "breedte", validation: {
                min: {value: 0, message: "Negatieve breedte niet toegestaan."},
            },
        },
        height: {
            type: types.num, label: "hoogte", validation: {
                min: {value: 0, message: "Negatieve hoogte niet toegestaan."},
            },
        },
        draft: {
            type: types.num, label: "diepgang", validation: {
                min: {value: 0, message: "Negatieve diepgang niet toegestaan."},
            },
        },
        superType: {
            type: types.obj, label: "supertype", target: "vesselType",
        },
        // subTypes: {
        //     type: types.arr, label: "subtypes", elements: "vesselType",
        // },
    },
    methods: "CRUD",
    summary: ["id", "nameNL", "nameEN"],
};


export function initializeEntitiesMetadata() {
    let noTypos = true;
    for (const entitiesKey in entitiesMetadata) {
        const entity = entitiesMetadata[entitiesKey];
        entity.name = entitiesKey;
        for (const summaryElement of entity.summary) {
            if (!entity.properties[summaryElement]) {
                console.log(`❌ typo in entitiesMetadata.${entitiesKey}.summary : '${summaryElement}'`);
                noTypos = false;
            }
        }
    }
    if (noTypos) {
        console.log('✔ the summaries in entitiesMetadata appear to have no typos.');
    }
}

export function createEmptyItem(metadata) {
    console.log(`--------metadata.name=`, metadata.name);
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

zyxMetadata = {zyx: {
    label: "Zyx",
    endpoint: "/zyxs",
    id: ["id"],
    properties: {
        id: {
            type: 'num', label: "id", readOnly: true,
        },
        name: {
            type: 'str', label: "naam", validation: {maxLength: 100},
        },
        description: {
            type: 'str', label: "beschrijving", validation: {maxLength: 1000}
        },
    },
    summary: ["id", "name"],
    methods: "CRUD",
}};


 */