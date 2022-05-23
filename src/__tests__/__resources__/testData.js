test('no test', () => {
});

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
    "config": {},
    "code": "ECONNABORTED"
};

export const vesselsResponse = {
    "data":
        [
            {
                "id": 1,
                "timestamp": 1640995200000,
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
                "timestamp": 1640995200000,
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
                "timestamp": 1640995200000,
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
                "timestamp": 1640995200000,
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

export const remoteTestcases = {
    ids: [{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}],
    summaries: [
        {"id": 1, "timestamp": 1640995200000, "hullNumber": "IMO8516990"},
        {"id": 2, "timestamp": 1640995200000, "hullNumber": "IMO9464883"},
        {"id": 3, "timestamp": 1640995200000, "hullNumber": "IMO9775749"},
        {"id": 4, "timestamp": 1640995200000, "hullNumber": "IMO9797735"}
    ],
    items: [
        {
            "id": 1,
            "timestamp": 1640995200000,
            "owner": null,
            "updater": null,
            "hullNumber": "IMO8516990",
            "constructionDate": null,
            "builder": null
        },
        {
            "id": 2,
            "timestamp": 1640995200000,
            "owner": null,
            "updater": null,
            "hullNumber": "IMO9464883",
            "constructionDate": null,
            "builder": null
        },
        {
            "id": 3,
            "timestamp": 1640995200000,
            "owner": null,
            "updater": null,
            "hullNumber": "IMO9775749",
            "constructionDate": null,
            "builder": null
        },
        {
            "id": 4,
            "timestamp": 1640995200000,
            "owner": null,
            "updater": null,
            "hullNumber": "IMO9797735",
            "constructionDate": null,
            "builder": null
        }
    ],

    vessel1: {
        "id": 1,
        "timestamp": 1640991600000,
        "owner": null,
        "updater": null,
        "hull": {},
        "name": "Sc Nordic",
        "image": null,
        "mmsi": null,
        "callSign": null,
        "vesselType": {},
        "homePort": {},
        "length": 110.0,
        "beam": 18.0,
        "draft": 5.6,
        "displacement": 4876.0,
        "startDate": 504918000000,
        "endDate": null
    },

}
