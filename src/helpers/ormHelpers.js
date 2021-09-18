import { entitiesMetadata } from './entitiesMetadata';
import { getRequest, findItem, postRequest, putRequest, deleteRequest } from './utils';

export const remote = {
    readIds: async function (metadata, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/ids';
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    readAll: async function (metadata, requestState, onSuccess, onFail) {
        const url = metadata.endpoint;
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    readByExample: async function (metadata, probe, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/qbe';
        await postRequest({
            url, payload: probe, requestState, onSuccess, onFail
        });
    },

    readByIds: async function (metadata, idArray, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/ids';
        await postRequest({
            url,
            payload: idArray,
            requestState,
            onSuccess,
            onFail
        })
    },

    findByUniqueField: async function (metadata, probe, requestState, onSuccess, onFail) {
        console.log(`ormHelpers » remote.findByUniqueField() \nprobe=`, probe, `metadata.name=`, metadata.name);
        const entries = Object.entries(probe);
        console.log(`findItem() entries=`, entries);
        const hit = entries.find(([k, v]) => !!v && (k in metadata.findItem.params));
        if (hit) {
            const [key, value] = hit;
            const param = metadata.findItem.params[key];
            let url = metadata.endpoint + metadata.findItem.endpoint;
            if (Array.isArray(param)) {
                url += param[0] + '=' + value + '&' + param[1] + '=' + probe[param[1]];
            } else {
                url += param + '=' + value;
            }
            await getRequest({url, requestState, onSuccess, onFail});
        }
    },

    read: async function (metadata, id, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + id;
        await getRequest({
            url, requestState, onSuccess, onFail
        });
    },

    create: async function (metadata, item, requestState, onSuccess, onFail) {
        const url = metadata.endpoint;
        await postRequest({
            url, payload: item, requestState, onSuccess, onFail
        });
    },

    update: async function (metadata, item, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + item.id;
        await putRequest({
            url, payload: item, requestState, onSuccess, onFail
        });
    },

    delete: async function (metadata, id, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + id;
        await deleteRequest({
            url, requestState, onSuccess, onFail
        });
    },
};


