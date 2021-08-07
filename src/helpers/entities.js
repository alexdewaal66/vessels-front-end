import { types } from './endpoints';

export const entities = {};

entities.xyz = {
    name: "xyz",
    label: "Xyz",
    endpoint: "/xyzs",
    id: [{name: "id", type: types.num}],
    properties: {
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
    summary: ["name", "xyzString", "ratio"],
    methods: "CRUD",
};

entities.user = {
    name: "user",
    label: "Gebruiker",
    endpoint: "/users",
    id: [{name: "username", type: types.str}],
    properties: [
        {name: "password", type: types.str, validation: {required: true}},
        {name: "enabled", type: types.bool},
        {name: "apikey", type: types.str},
        {name: "email", type: types.str},
        {name: "authorities", type: types.arr, ref: "authority"},
    ],
    methods: "CRUD",
};

entities.authority = {
    name: "authority",
    label: "Machtiging",
    endpoint: "/users/{username}/authorities",
    id: [
        {name: "username", type: types.str},
        {name: "authority", type: types.str},
    ],
    properties: [],
    methods: "R",
};

entities.country = {
    name: "country",
    label: "Land",
    endpoint: "/countries",
    id: [{name: "id", type: types.num}],
    properties: {
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
    methods: "R",
};
entities.country.summary = ["shortNameNL", "alpha2Code", "alpha3Code"];

entities.vesselType = {
    name: "vesseltype",
    label: "Scheepstype",
    endpoint: "/vesseltypes",
    id: [{name: "id", type: types.num}],
    properties: {
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
        subTypes: {
            type: types.arr, label: "subtypes", elements: "vesselType",
        },
    },
    methods: "CRUD",
    summary: ["nameNL", "nameEN"],
};
