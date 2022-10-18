const json = {
    "id": 2,
    "username": "deskundige",
    "roles": [
        {
            "id": 1,
            "timestamp": 1640991600000,
            "name": "ROLE_MEMBER"
        },
        {
            "id": 2,
            "timestamp": 1640991600000,
            "name": "ROLE_EXPERT"
        },
        {
            "id": 3,
            "timestamp": 1640991600000,
            "name": "ROLE_ADMIN"
        }
    ]
}


const register = () => null;//placeholder for React Hook Form fn

const x = {
    ...register("test1", {
        validate: {
            positive: v => parseInt(v) > 0 || 'should be greater than 0',
            lessThanTen: v => parseInt(v) < 10 || 'should be lower than 10',
            // you can do asynchronous validation as well
            checkUrl: async () => await fetch() || 'error message',  // JS only: <p>error message</p> TS only support string
            messages: v => !v && ['test', 'test2']
        }
    })
}