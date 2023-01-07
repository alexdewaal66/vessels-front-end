import React, { Fragment, useContext, useState } from 'react';
import { logv, pathMkr, rootMkr } from '../dev/log';
// import { Stringify } from '../dev/Stringify';
import { entityNames, entityTypes } from '../helpers/globals/entityTypes';
import { sessionConfig } from '../helpers/globals/sessionConfig';
import { endpoints, languageSelector } from '../helpers';
import { StorageContext } from '../contexts';
import {formStyles} from '../formLayouts';
import { crossFieldExpansion } from '../helpers/crossFieldExpansion';

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
    // logv(logRoot, {typeField, defaultValue});
    const typeField = entityType.fields[fieldName];

    const {newItem, loadItem} = useContext(StorageContext);

    const {register, setValue, getValues} = entityForm;

    const [selectedFiles, setSelectedFiles] = useState({});
    const [imageId, setImageId] = useState(defaultValue.id);
    const [imageFeedback, setImageFeedback] = useState('—');
    const [fullSizeImageId, setFullSizeImageId] = useState(
        typeof defaultValue === 'object'
            ? defaultValue.fullSizeId
            : defaultValue
    );
    // const hiddenFieldName = 'hidden_' + fieldName + '_' + typeField.target + '_id';
    const hiddenFieldName = fieldName;

    const hiddenFieldStyle = sessionConfig.showHiddenFields.value
        ? {opacity: '50%', cursor: 'default'} : {opacity: '0', position: 'absolute', width: 0};

    setValue(hiddenFieldName, imageId);

    const isFileSelected = '0' in selectedFiles;
    const buttonStyle = isFileSelected ? formStyles.enabled : formStyles.disabled;

    const TXT = messages[languageSelector()];

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
        setImageFeedback('F:❌');
        // setImageFeedback('❌');
    }

    function onUploadSuccess(fullSize) {
        const logPath = pathMkr(logRoot, onUploadSuccess);
        logv(logPath, {fileItem: fullSize}, 'succes ');
        logv(null, {fileItem: fullSize}, 'Succes');
        setImageFeedback('F:✔ id=' + fullSize.id + ' / ' + ' name=' + fullSize.name);
        newItem(entityNames.image, {id: null, fullSize}, onImageSuccess, onImageFail);
    }

    function onImageFail(error) {
        const logPath = pathMkr(logRoot, onImageFail);
        logv(logPath, {error}, 'fail ');
        setImageFeedback(current => current + ', I:❌');
        // setImageFeedback('❌');
    }

    function onImageSuccess(imageItem) {
        // const logPath = pathMkr(logRoot, onImageSuccess);
        // logv(logPath, {imageItem});
        setImageId(imageItem.id);
        setFullSizeImageId(imageItem.fullSize.id);
        setValue(hiddenFieldName, imageItem.id);
        setImageFeedback(current => current + ', I:✔ id=' + imageItem.id);
        loadItem(entityTypes.image.name, imageItem.id, onReloadSuccess, onReloadFail);
    }

    function onReloadFail() {
        // const logPath = pathMkr(logRoot, onReloadSuccess);
        // logv(logPath, {imageItem});
        setImageFeedback(current => current + ', R:❌');
        // setImageFeedback('❌');
    }

    function onReloadSuccess() {
        // const logPath = pathMkr(logRoot, onReloadSuccess);
        // logv(logPath, {imageItem});
        setImageFeedback(current => current + ', R:✔');
        // setImageFeedback('✔');
    }


    return (
        <Fragment key={elKey + 'inputImage'}>
            {!readOnly && (
                <div>
                    <input
                        type={'number'}
                        style={hiddenFieldStyle}
                        tabIndex={-1}
                        // style={{opacity: '0', position: 'absolute'}}
                        // style={{opacity: '50%'}}
                        name={fieldName}
                        defaultValue={defaultValue}
                        readOnly={readOnly}
                        {...register(fieldName, crossFieldExpansion(typeField, getValues))}
                        key={elKey + fieldName + 'hidden'}
                    />
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

