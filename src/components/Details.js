import React, { useState, useContext } from 'react';
import { TTC, TT } from '../dev/Tooltips';
import { useConditionalEffect, transform } from '../helpers';
import { ShowRequestState } from './ShowRequestState';
import { StorageContext } from '../contexts/StorageContext';
import { ShowObjectOld } from '../dev/ShowObjectOld';

export function Details({metadata, field, value, item, children}) {
    // const logRoot = rootMkr(Details, metadata.name, '↓↓');
    // logv(logRoot, {field, value, item});
    const storage = useContext(StorageContext);
    const {rsStatus} = storage;
    const [detailsId, setDetailsId] = useState();
    const property = metadata.properties[field];
    const target = property?.details;

    function fetchItem() {
        // const logPath = pathMkr(logRoot, fetchItem);
        const probe = item;
        // logv(logPath, {target, probe});
        storage.loadItemByUniqueFields(target, probe, setDetailsId);
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
                        <ShowObjectOld
                            entityName={target === 'transform'
                                ? null
                                : target
                            }
                            data={target === 'transform'
                                ? transform(metadata.name, field, value)
                                : storage.getItem(target, detailsId)
                            }
                        />
                    </TT>
                </React.Fragment>
            )}
        </TTC>
    );
}
