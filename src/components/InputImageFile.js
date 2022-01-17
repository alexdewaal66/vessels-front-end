import React, { useState } from 'react';
import { logv } from '../dev/log';
import { remote, RequestState } from '../helpers';

export function InputImageFile({
                                   metadata, field, readOnly,
                                   defaultValue, useFormFunctions, elKey
                               }) {
    const logRoot = `${InputImageFile.name}(${metadata.name})`;
    logv(logRoot, {field, defaultValue, '!defaultValue': !defaultValue});
    const property = metadata.properties[field];

    const [selectedFiles, setSelectedFiles] = useState();
    const [feedback, setFeedback] = useState('...');

    function onFileSelect(event) {
        const logPath = `${logRoot} » ${onFileSelect.name}()`;
        logv(logPath, {event});
        setSelectedFiles(event.target.files);
        setFeedback('...');
    }

    function onUpload(event) {
        const logPath = `🛄🛄🛄🛄 ${logRoot} » ${onUpload.name}()`;
        // logv(logPath, {event, selectedFile: selectedFiles});
        event.preventDefault();
        const file = selectedFiles[0];
        logv(null, {file});
        const requestState = new RequestState();
        remote.fileUpload(file, requestState, onSuccess, onFail).then();
    }

    function onSuccess(response) {
        const logPath = `🛄🛄🛄🛄 ${logRoot} » ${onSuccess.name}()`;
        logv(null, {response}, 'succes ');
        const dataParts = response.data.split(' ');
        const fileId = (dataParts[0] === 'StandardMultipartFile' && dataParts[2] === 'created')
            ? dataParts[1]
            : null;
        logv(null, {fileId}, 'Succes');
        useFormFunctions.setValue(hiddenFieldName, fileId);
        setFeedback('✔' + fileId);
    }

    function onFail(error) {
        const logPath = `🛄🛄🛄🛄 ${error} » ${onFail.name}()`;
        logv(null, {error}, 'fail ');
        setFeedback('❌');
    }

    const hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';

    return (
        <>
            <input type="text"
                   readOnly={true}
                   name={hiddenFieldName}
                   id={field}
                   defaultValue={defaultValue.id}
                   {...useFormFunctions.register(hiddenFieldName)}
                   key={elKey + hiddenFieldName + '_imgId'}
            />
            <input type="file" accept="image/jpeg"
                   onChange={onFileSelect}
            />
            <button type="button" onClick={onUpload}>
                Verstuur
            </button>
            &nbsp;{feedback}
        </>
    );
}