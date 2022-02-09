import React, { useContext, useState } from 'react';
import { entitiesMetadata } from '../helpers';
import { logv } from './log';
import { StorageContext } from '../contexts/StorageContext';

function property(key, entityName) {
    return entityName
        ? entitiesMetadata[entityName].properties[key].label
        : key;
}

function initCollapsedKeys(data) {
    let dict = {};
    if (data)
        dict = Object.fromEntries(Object.keys(data).map(k => [k, true]));
    return dict;
}

export function ShowObject({entityName, data, identifier}) {
    const {store} = useContext(StorageContext);

    // if (identifier) data = {[identifier]: {...data}};
    const [collapsedKeys, setCollapsedKeys] = useState(initCollapsedKeys(data));
    const entries = data ? (Array.isArray(data) ? data : Object.entries(data)) : null;

    // if (data) console.log(`ShowObject \n\t data=`, data);

    const toggle = (key) => () => {
        setCollapsedKeys(currentKeys => (
            {...currentKeys, [key]: !currentKeys[key]}
        ));
    }

    function addPath(propName) {
        // return isNaN(propName) ? '.' + propName : '[' + propName + ']';
        return '[\'' + propName + '\']';
    }

    return ((data)
            ? <>
                {entityName && (
                    <>
                        {entitiesMetadata[entityName].label}
                    </>
                )}
                <ul key={identifier}>
                    {entries.map(([key, value]) => {
                            const propName = property(key, entityName);
                            const path = identifier + addPath(propName);
                            try {
                                value = eval(path);
                            } catch (error) {
                                logv('🔑🔑🔑🔑🔑🔑', {path});
                            }
                            const isObject = (typeof value === 'object' && !!value);
                            return <li key={key} style={{listStyleType: 'none'}}>
                                {isObject
                                    ? <span style={{whiteSpace: 'pre', cursor: 'pointer'}}
                                            onClick={toggle(key)}>
                                                {collapsedKeys[key] ? '+' : '-'}&nbsp;{propName}:&nbsp;
                                          </span>
                                    : <span style={{whiteSpace: 'pre'}}>
                                                {path}:&nbsp;
                                          </span>
                                }
                                {collapsedKeys[key] ? null :
                                    <>{isObject
                                        ? <ShowObject data={value} identifier={path}/>
                                        : <>{value}</>
                                    }</>
                                }
                            </li>;
                        }
                    )}
                </ul>
            </>
            : 'null'
    )
}
