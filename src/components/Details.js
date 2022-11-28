import React, { useContext, useState } from 'react';
import { Tooltip, TooltipContainer } from './Tooltips';
import { transform, useConditionalEffect } from '../helpers';
import { ShowRequestState } from './ShowRequestState';
import { StorageContext } from '../contexts';
import { ShowObject } from './ShowObject';

export function Details({entityType, fieldName, value, item, children}) {
    // const logRoot = rootMkr(Details, entityType.name, '↓↓');
    // logv(logRoot, {field, value, item});
    const storage = useContext(StorageContext);
    const {rsStatus} = storage;
    const [detailsId, setDetailsId] = useState();
    const typeField = entityType.fields[fieldName];
    const target = typeField?.details;

    function fetchItem() {
        // const logPath = pathMkr(logRoot, fetchItem);
        // logv(logPath, {target, item});
        storage.loadItemByUniqueFields(target, item, setDetailsId);
    }

    useConditionalEffect((target && value && target !== 'transform'), fetchItem, [target]);


    return (
        <TooltipContainer>
            <ShowRequestState {...rsStatus} description={rsStatus.description}/>
            {children}
            {target && value && (
                <React.Fragment key={fieldName + target}>
                    &nbsp;»
                    <Tooltip style={{textAlign: "left", marginLeft: "100%", top: "0"}}>
                        <ShowObject
                            entityName={target === 'transform'
                                ? null
                                : target
                            }
                            data={target === 'transform'
                                ? transform(entityType.name, fieldName, value)
                                : storage.getItem(target, detailsId)
                            }
                        />
                    </Tooltip>
                </React.Fragment>
            )}
        </TooltipContainer>
    );
}
