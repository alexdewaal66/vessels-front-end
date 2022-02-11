import React, { useState, useContext } from 'react';
import { TTC, TT } from '../dev/Tooltips';
import { useConditionalEffect, transform } from '../helpers';
import { ShowRequestState } from './ShowRequestState';
import { StorageContext } from '../contexts/StorageContext';
import { ShowObject } from '../dev/ShowObject';

export function Details({metadata, field, value, item, children}) {
    // const logRoot = rootMkr(Details, metadata.name, '↓↓');
    // logv(logRoot, {field, value, item});
    const {rsStatus, getItem, loadItemByUniqueFields} = useContext(StorageContext);
    const [detailsId, setDetailsId] = useState();
    const property = metadata.properties[field];
    const target = property?.details;

    function fetchItem() {
        // const logPath = pathMkr(logRoot, fetchItem);
        const probe = item;
        // logv(logPath, {target, probe});
        loadItemByUniqueFields(target, probe, setDetailsId);
    }

    useConditionalEffect(fetchItem, (target && value && target !== 'transform'), [target]);


    return (
        <TTC>
            <ShowRequestState {...rsStatus} description={rsStatus.description + '(details) '}/>
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
                                ? transform(metadata.name, field, value)
                                : getItem(target, detailsId)
                            }
                        />
                    </TT>
                </React.Fragment>
            )}
        </TTC>
    );
}
