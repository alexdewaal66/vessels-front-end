export const endpoints = {
    baseURL: 'http://localhost:8080/',
    signIn: '/authenticate',
    // signUp: '/register',
    users: '/users/',
    xyzs: '/xyzs',
    profile: '/profile',
};

export const types = {
    str: 'string',
    num: 'number',
    bool: 'boolean',
    img: 'image',
    arr: 'array',
    obj: 'object',
};

export const subtypes = {
    password: 'password',
    email: 'email',
    date: 'date',
    url: 'url',
};

export const entities = {
    xyz: {
        name: "xyz",
        label: "Xyz",
        endpoint: "/xyzs",
        id: [{name: "id", type: types.num}],
        properties: {
            name: {
                type: types.str, label: "naam", validation: {maxLength: 100}
            },
            xyzString: {
                type: types.str, validation: {maxLength: 200}
            },
            ratio: {
                type: types.num, validation: {
                    min: {value: 0, message: "Negatieve ratios niet toegestaan"}
                }
            },
            description: {
                type: types.str, label: "beschrijving", validation: {maxLength: 1000}
            },
        },
        methods: "CRUD",
        summary: ["name", "xyzString", "ratio"],
    },
    user: {
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
    },
    authority: {
        name: "authority",
        label: "Machtiging",
        endpoint: "/users/{username}/authorities",
        id: [
            {name: "username", type: types.str},
            {name: "authority", type: types.str},
        ],
        properties: [],
        methods: [],
    },
    country: {
        name: "country",
        label: "Land",
        endpoint: "/countries",
        id: [{name: "id", type: types.num}],
        properties: {
            shortNameNl: {
                type: types.str, label: "naam (NL)", validation: {maxLength: 100}
            },
            shortNameEn: {
                type: types.str, label: "naam (EN)", validation: {maxLength: 100}
            },
            alpha2Code: {
                type: types.str, label: "alfa 2 code", validation: {maxLength: 2}
            },
            alpha3Code: {
                type: types.str, label: "alfa 3 code", validation: {maxLength: 3}
            },
            numericCode: {
                type: types.str, label: "numerieke code", validation: {maxLength: 3}
            },
        },
        methods: "R",
        summary: ["shortNameNl", "alpha2Code", "alpha3Code"],
    }
}
