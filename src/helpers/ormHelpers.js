import { entitiesMetadata } from './entitiesMetadata';
import { getRequest, findItem, postRequest, putRequest, deleteRequest } from './utils';

export const remote = {
    readIds: function (metadata, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/ids';
        getRequest({
            url, requestState, onSuccess, onFail});
    },

    readAll: function (metadata, requestState, onSuccess, onFail) {
        const url = metadata.endpoint;
        getRequest({
            url, requestState, onSuccess, onFail});
    },

    readByExample: function (metadata, probe, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/qbe';
        postRequest({
            url, payload: probe, requestState, onSuccess, onFail});
    },

    readByIds: function (metadata, idArray, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/ids';
        postRequest({
            url,
            payload: idArray,
            requestState,
            onSuccess,
            onFail
        })
    },

    findByUniqueProp: findItem,

    read: function (metadata, id, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + id;
        getRequest({
            url, requestState, onSuccess, onFail});
    },

    create: function (metadata, item, requestState, onSuccess, onFail) {
        const url = metadata.endpoint;
        postRequest({
            url, payload: item, requestState, onSuccess, onFail});
    },

    update: function (metadata, item, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + item.id;
        putRequest({
            url, payload: item, requestState, onSuccess, onFail});
    },

    delete: function (metadata, id, requestState, onSuccess, onFail) {
        const url = metadata.endpoint + '/' + id;
        deleteRequest({
            url, requestState, onSuccess, onFail});
    },
};


