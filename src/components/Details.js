import React, { useContext, useState } from 'react';
import { TT, TTC } from './Tooltips';
import { transform, useConditionalEffect } from '../helpers';
import { ShowRequestState } from './ShowRequestState';
import { StorageContext } from '../contexts/StorageContext';
import { ShowObject } from '../dev/ShowObject';

export function Details({entityType, field, value, item, children}) {
    // const logRoot = rootMkr(Details, entityType.name, '↓↓');
    // logv(logRoot, {field, value, item});
    const storage = useContext(StorageContext);
    const {rsStatus} = storage;
    const [detailsId, setDetailsId] = useState();
    const property = entityType.properties[field];
    const target = property?.details;

    function fetchItem() {
        // const logPath = pathMkr(logRoot, fetchItem);
        // logv(logPath, {target, item});
        storage.loadItemByUniqueFields(target, item, setDetailsId);
    }

    useConditionalEffect(fetchItem, (target && value && target !== 'transform'), [target]);


    return (
        <TTC>
            <ShowRequestState {...rsStatus} description={rsStatus.description}/>
            {children}
            {target && value && (
                <React.Fragment key={field + target}>
                    &nbsp;»
                    <TT style={{textAlign: "left", marginLeft: "100%", top: "0"}}>
                        <ShowObject
                            entityName={target === 'transform'
                                ? null
                                : target
                            }
                            data={target === 'transform'
                                ? transform(entityType.name, field, value)
                                : storage.getItem(target, detailsId)
                            }
                        />
                    </TT>
                </React.Fragment>
            )}
        </TTC>
    );
}
