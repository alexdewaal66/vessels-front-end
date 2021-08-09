import { types } from './endpoints';

export const entities = {};

entities.xyz = {
    name: "xyz",
    label: "Xyz",
    endpoint: "/xyzs",
    id: ["id"],
    properties: {
        id: {type: types.num, label: "id"},
        name: {
            type: types.str, label: "naam", validation: {maxLength: 100},
        },
        xyzString: {
            type: types.str, validation: {maxLength: 200},
        },
        ratio: {
            type: types.num, validation: {
                min: {value: 0, message: "Negatief ratio niet toegestaan."},
            },
        },
        description: {
            type: types.str, label: "beschrijving", validation: {maxLength: 1000}
        },
    },
    summary: ["id", "name", "xyzString", "ratio"],
    methods: "CRUD",
};

entities.user = {
    name: "user",
    label: "Gebruiker",
    endpoint: "/users",
    id: ["username"],
    properties: {
        username: {
            label: "username", type: types.str
        },
        password: {
            label: "password", type: types.str, validation: {
                required: true
            }
        },
        enabled: {
            label: "enabled", type: types.bool
        },
        apikey: {
            label: "apikey", type: types.str
        }
        ,
        email: {
            label: "email", type: types.str
        }
        ,
        authorities: {
            label: "authorities", type: types.arr, ref: "authority"
        },
    },
    summary: ["username", "email"],
    methods: "CRUD",
};

entities.authority = {
    name: "authority",
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
    methods: "R",
};

entities.country = {
    name: "country",
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

entities.vesselType = {
    name: "vesseltype",
    label: "Scheepstype",
    endpoint: "/vesseltypes",
    id: ["id"],
    properties: {
        id: {
            type: types.num
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

/*

 */