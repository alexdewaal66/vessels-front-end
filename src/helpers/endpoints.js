export const endpoints = {
    baseURL: 'http://localhost:8080/',
    signIn: '/authenticate',
    // signUp: '/register',
    users: '/users/',
    xyzs: '/xyzs',
    profile: '/profile',
};

const types = {
    str: 'string',
    num: 'numeric',
    bool: 'boolean',
    img: 'image',
    arr: 'array',
    obj: 'object',
};

const entities = {
    xyz: {
        name: "Xyz",
        endpoint: "/xyzs",
        id: [{name: "id", type: types.num}],
        properties: [
            {name: "xyzString", type: types.str},
            {name: "name", type: types.str, label: "naam"},
            {name: "desc", type: types.str, label: "beschrijving"},
            {name: "ratio", type: types.num}
        ],
        methods: "CRUD",
    },
    user: {
        name: "User",
        endpoint: "/users",
        id: [{name: "username", type: types.str}],
        properties: [
            {name: "password", type: types.str},
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