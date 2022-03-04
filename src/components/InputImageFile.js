import React, { Fragment, useContext, useState } from 'react';
import { logv, pathMkr, rootMkr } from '../dev/log';
import { endpoints, entityTypes } from '../helpers';
import { StorageContext } from '../contexts/StorageContext';

export function InputImageFile({
                                   entityType, field, readOnly,
                                   defaultValue, useFormFunctions, elKey
                               }) {
    const logRoot = rootMkr(InputImageFile, entityType.name, '↓↓');
    // logv(logRoot, {field, defaultValue});
    const property = entityType.properties[field];

    const {newItem, loadItem} = useContext(StorageContext);

    const [selectedFiles, setSelectedFiles] = useState();
    const [imageId, setImageId] = useState(defaultValue.id);
    const [imageFeedback, setImageFeedback] = useState('...');
    const [fullSizeImageId, setFullSizeImageId] = useState(
        typeof defaultValue === 'object'
            ? defaultValue.fullSizeId
            : defaultValue
    );
    const hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';
    useFormFunctions.setValue(hiddenFieldName, imageId);

    function onFileSelect(event) {
        // const logPath = pathMkr(logRoot, onFileSelect);
        // logv(logPath, {event});
        setSelectedFiles(event.target.files);
        setImageFeedback('...');
    }

    function onFileUpload(event) {
        // const logPath = pathMkr(logRoot, onFileUpload);
        // logv(logPath, {event, selectedFile: selectedFiles});
        event.preventDefault();
        const file = selectedFiles[0];
        // logv(logPath, {file});
        newItem('file', file, onUploadSuccess, onUploadFail);
    }

    function onUploadSuccess(fileItem) {
        // const logPath = pathMkr(logRoot, onUploadSuccess);
        // logv(logPath, {fileItem}, 'succes ');
        // logv(null, {fileItem_id: fileItem.id}, 'Succes');
        newItem('image', {id: null, fullSizeId: fileItem.id}, onImageSuccess, onImageFail);
    }

    function onUploadFail(error) {
        const logPath = pathMkr(logRoot, onUploadFail);
        logv(logPath, {error}, 'fail ');
        setImageFeedback('❌');
    }

    function onImageSuccess(imageItem) {
        // const logPath = pathMkr(logRoot, onImageSuccess);
        // logv(logPath, {imageItem});
        setImageId(imageItem.id);
        setFullSizeImageId(imageItem.fullSizeId);
        useFormFunctions.setValue(hiddenFieldName, imageItem.id);
        loadItem(entityTypes.image.name, imageItem.id, onReloadSuccess);
    }

    function onReloadSuccess(imageItem) {
        // const logPath = pathMkr(logRoot, onReloadSuccess);
        // logv(logPath, {imageItem});
        setImageFeedback('✔');
    }

    function onImageFail(error) {
        const logPath = pathMkr(logRoot, onImageFail);
        logv(logPath, {error}, 'fail ');
        setImageFeedback('❌');
    }


    return (
        <Fragment key={elKey + 'inputImage'}>
            <div>
                <input type="file" accept="image/jpeg"
                       onChange={onFileSelect}
                       readOnly={readOnly}
                />
                <button type="button" onClick={onFileUpload}>
                    Verstuur
                </button>
                &nbsp;{imageFeedback}
            </div>

            {fullSizeImageId && (
                <>
                    <img
                        src={endpoints.baseURL + 'files/' + fullSizeImageId}
                        alt="fullSize" height={400}
                    />
                </>
            )}
        </Fragment>
    );
}

