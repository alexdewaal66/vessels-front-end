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
        name: "Xyz",
        endpoint: "/xyzs",
        id: [{name: "id", type: types.num}],
        properties: {
            xyzString: {type: types.str, validation: {maxLength: 200}},
            name: {type: types.str, label: "naam", validation: {maxLength: 100}},
            description: {type: types.str, label: "beschrijving", validation: {maxLength: 1000}},
            ratio: {type: types.num, validation: {min: {value: 0, message: "Negative ratios not allowed"}}}
        },
        methods: "CRUD",
    },
    user: {
        name: "User",
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
        name: "Authority",
        endpoint: "/users/{username}/authorities",
        id: [
            {name: "username", type: types.str},
            {name: "authority", type: types.str},
        ],
        properties: [],
        methods: [],
    },
}
