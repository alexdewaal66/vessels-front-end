export const responseSchema = {
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {}
}

export const errorSchema = {
    "message": "",
    "name": "",
    "stack": "",
    "config": {
        "url": "",
        "method": "",
        "headers": {},
        "baseURL": "",
        "transformRequest": [null],
        "transformResponse": [null],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1
    },
    "code": "ECONNABORTED"
};

export const vesselsResponse = {
    "data":
        [
            {
                "id": 1,
                "timestamp": 1640991600000,
                "owner": null,
                "updater": null,
                "shortNameNL": "Afghanistan",
                "shortNameEN": "Afghanistan",
                "alpha2Code": "AF",
                "alpha3Code": "AFG",
                "numericCode": "4"
            },
            {
                "id": 2,
                "timestamp": 1640991600000,
                "owner": null,
                "updater": null,
                "shortNameNL": "Albania",
                "shortNameEN": "Albania",
                "alpha2Code": "AL",
                "alpha3Code": "ALB",
                "numericCode": "8"
            },
            {
                "id": 3,
                "timestamp": 1640991600000,
                "owner": null,
                "updater": null,
                "shortNameNL": "Ãland Islands",
                "shortNameEN": "Aland Islands",
                "alpha2Code": "AX",
                "alpha3Code": "ALA",
                "numericCode": "248"
            },
            {
                "id": 249,
                "timestamp": 1640991600000,
                "owner": null,
                "updater": null,
                "shortNameNL": "Zimbabwe",
                "shortNameEN": "Zimbabwe",
                "alpha2Code": "ZW",
                "alpha3Code": "ZWE",
                "numericCode": "716"
            }
        ],
    "status": 200,
    "statusText": "",
    "headers":
        {
            "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
            "content-type": "application/json",
            "expires": "0",
            "pragma": "no-cache"
        }
    ,
    "config":
        {
            "url": "/countries",
            "method": "get",
            "headers":
                {
                    "Accept": "application/json, text/plain, */*",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXNrdW5kaWdlIiwiZXhwIjoxNjUzMTE1NTYwLCJpYXQiOjE2NTIyNTE1NjB9.Orb_y1zV3bXjPp4sMwBrUM-4fb6YFRwRbIBuzGgyAr4"
                },
            "baseURL": "http://localhost:8080",
            "transformRequest": [null],
            "transformResponse": [null],
            "timeout": 15000,
            "xsrfCookieName": "XSRF-TOKEN",
            "xsrfHeaderName": "X-XSRF-TOKEN",
            "maxContentLength": -1, "maxBodyLength": -1
        }
    ,
    "request": {}
}


export const vesselsError = {
    "message": "timeout of 15ms exceeded",
    "name": "Error",
    "stack": "Error: timeout of 15ms exceeded\n    at createError (http://localhost:3000/static/js/vendors~main.chunk.js:970:15)\n    at XMLHttpRequest.handleTimeout (http://localhost:3000/static/js/vendors~main.chunk.js:477:14)",
    "config": {
        "url": "/users/deskundige",
        "method": "get",
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXNrdW5kaWdlIiwiZXhwIjoxNjUzMTE1NTYwLCJpYXQiOjE2NTIyNTE1NjB9.Orb_y1zV3bXjPp4sMwBrUM-4fb6YFRwRbIBuzGgyAr4"
        },
        "baseURL": "http://localhost:8080",
        "transformRequest": [null],
        "transformResponse": [null],
        "timeout": 15,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1
    },
    "code": "ECONNABORTED"
};

test('no test', () => {
});
