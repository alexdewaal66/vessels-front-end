import React, { useState } from 'react';
import { endpoints } from '../helpers';
import { RequestState } from '../helpers';
import { remote } from '../helpers';

export function TestMultipartFile() {
    // const logRoot = TestMultipartFile.name;
    const [selectedFiles, setSelectedFiles] = useState();
    const [feedback, setFeedback] = useState('...');

    function onFileSelect(event) {
        // const logPath = pathMkr(logRoot, onFileSelect);
        // logv(logPath, {event});
        setSelectedFiles(event.target.files);
        setFeedback('...');
    }

    function onUpload(event) {
        // const logPath = pathMkr(logRoot, onUpload);
        // logv(logPath, {event, selectedFile: selectedFiles});
        event.preventDefault();
        const file = selectedFiles[0];
        // logv(null, {file});
        const requestState = new RequestState();
        remote.fileUpload(file, requestState, onSuccess, onFail).then();
    }

    function onSuccess(response) {
        // const logPath = pathMkr(logRoot, onSuccess);
        // logv(logPath, {response}, 'succes ');
        const dataParts = response.data.split(' ');
        const fileId = (dataParts[0] === 'file' && dataParts[2] === 'created')
            ? dataParts[1]
            : null;
        // logv(null, {fileId}, 'Succes');
        setFeedback('✔ #' + fileId);
    }

    function onFail(error) {
        // const logPath = pathMkr(logRoot, onFail);
        // logv(logPath, {error}, '❌ ');
        setFeedback('❌');
    }

    return (
        <>
            <form onSubmit={onUpload}>
                <input type="file" accept="image/jpeg"
                       onChange={onFileSelect}
                />
                <button type="submit">Verstuur</button>
                &nbsp;{feedback}
            </form>
            <img src={endpoints.baseURL + 'files/1'} alt="1"/>
            <img src={endpoints.baseURL + 'files/2'} alt="2"/>
        </>
    );
}

/*

 */