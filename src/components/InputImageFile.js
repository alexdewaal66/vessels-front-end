import React, { Fragment, useContext, useState } from 'react';
import { logv, pathMkr, rootMkr } from '../dev/log';
// import { Stringify } from '../dev/Stringify';
import { endpoints, entityTypes, language } from '../helpers';
import { StorageContext } from '../contexts';
import {formStyles} from '../formLayouts';

const messages = {
    NL: {
        send: 'Verstuur',
    },
    EN: {
        send: 'Send',
    }
};

export function InputImageFile({
                                   entityType, fieldName, readOnly,
                                   defaultValue, entityForm, elKey
                               }) {
    const logRoot = rootMkr(InputImageFile, entityType.name, '↓↓');
    // logv(logRoot, {field, defaultValue});
    const field = entityType.fields[fieldName];

    const {newItem, loadItem} = useContext(StorageContext);

    const [selectedFiles, setSelectedFiles] = useState({});
    const [imageId, setImageId] = useState(defaultValue.id);
    const [imageFeedback, setImageFeedback] = useState('—');
    const [fullSizeImageId, setFullSizeImageId] = useState(
        typeof defaultValue === 'object'
            ? defaultValue.fullSizeId
            : defaultValue
    );
    const hiddenFieldName = 'hidden_' + fieldName + '_' + field.target + '_id';
    entityForm.setValue(hiddenFieldName, imageId);

    const isFileSelected = '0' in selectedFiles;
    const buttonStyle = isFileSelected ? formStyles.enabled : formStyles.disabled;

    const TXT = messages[language()];

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

    function onUploadFail(error) {
        const logPath = pathMkr(logRoot, onUploadFail);
        logv(logPath, {error}, 'fail ');
        // setImageFeedback('F:❌');
        setImageFeedback('❌');
    }

    function onUploadSuccess(fileItem) {
        const logPath = pathMkr(logRoot, onUploadSuccess);
        logv(logPath, {fileItem}, 'succes ');
        logv(null, {fileItem_id: fileItem.id}, 'Succes');
        // setImageFeedback('F:✔ id=' + fileItem.id);
        newItem('image', {id: null, fullSizeId: fileItem.id}, onImageSuccess, onImageFail);
    }

    function onImageFail(error) {
        const logPath = pathMkr(logRoot, onImageFail);
        logv(logPath, {error}, 'fail ');
        // setImageFeedback(current => current + ', I:❌');
        setImageFeedback('❌');
    }

    function onImageSuccess(imageItem) {
        // const logPath = pathMkr(logRoot, onImageSuccess);
        // logv(logPath, {imageItem});
        setImageId(imageItem.id);
        setFullSizeImageId(imageItem.fullSizeId);
        entityForm.setValue(hiddenFieldName, imageItem.id);
        // setImageFeedback(current => current + ', I:✔ id=' + imageItem.id);
        loadItem(entityTypes.image.name, imageItem.id, onReloadSuccess, onReloadFail);
    }

    function onReloadFail(imageItem) {
        // const logPath = pathMkr(logRoot, onReloadSuccess);
        // logv(logPath, {imageItem});
        // setImageFeedback(current => current + ', R:❌');
        setImageFeedback('❌');
    }

    function onReloadSuccess(imageItem) {
        // const logPath = pathMkr(logRoot, onReloadSuccess);
        // logv(logPath, {imageItem});
        // setImageFeedback(current => current + ', R:✔');
        setImageFeedback('✔');
    }


    return (
        <Fragment key={elKey + 'inputImage'}>
            {!readOnly && (
                <div>
                    <input type="file" accept="image/jpeg"
                           onChange={onFileSelect}
                    />
                    <button type="button"
                            onClick={onFileUpload}
                            disabled={!isFileSelected}
                            className={buttonStyle}
                    >
                        {TXT.send}
                    </button>
                    &nbsp;{imageFeedback}
                </div>
            )}

            {fullSizeImageId && (
                <>
                    <img
                        src={endpoints.baseURL + entityTypes.file.downloadEndpoint(fullSizeImageId)}
                        alt="fullSize" height={400}
                    />
                </>
            )}
        </Fragment>
    );
}

