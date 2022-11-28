import { entityNameList, entityTypes } from '../helpers/globals/entityTypes';
import { sessionConfig } from '../helpers/globals/sessionConfig';
import { Aside } from '../pageLayouts';
import { Stringify } from './Stringify';
import React, { useContext, useState } from 'react';
import { StorageContext } from '../contexts';

function StringifyOnSelect({keyList, placeholder, dataObject, defaultProperty = null}) {
    const keyFlags = Object.fromEntries(keyList.map(key => [key, false]));
    const [selectedKeys, setSelectedKeys] = useState(keyFlags);

    function data(key) {
        return defaultProperty ? dataObject[key][defaultProperty] : dataObject[key];
    }

    const changeHandler = (e) => {
        const changedKey = e.target.value;
        setSelectedKeys(current => ({...current, [changedKey]: !current[changedKey]}));
        e.target.value = placeholder;
    }

    return (
        <div>
            <select onChange={changeHandler} defaultValue={placeholder}>
                <option value={placeholder} disabled>{placeholder}</option>
                {keyList.map(
                    key =>
                        <option value={key} key={key}>
                            {selectedKeys[key] ? '✔ ' : '\xA0\xA0\xA0\xA0'}
                            {key}
                        </option>
                )}
            </select>
            {Object.entries(selectedKeys).map(
                ([key, flag]) =>
                    (flag
                            ? <Stringify data={data(key)} key={key}>{key}{defaultProperty && '.'+defaultProperty}</Stringify>
                            : null
                    )
            )}
        </div>
    )
}

export function ShowStore() {
    const {store} = useContext(StorageContext);

    return  ((sessionConfig.showEntities.value) &&
        <Aside>
                <StringifyOnSelect keyList={Object.keys(store)}
                                   placeholder={'store'}
                                   dataObject={store}
                                   // defaultProperty={'state'}
                />
                <StringifyOnSelect keyList={entityNameList}
                                   placeholder={'types'}
                                   dataObject={entityTypes}
                />
        </Aside>
    );
}
