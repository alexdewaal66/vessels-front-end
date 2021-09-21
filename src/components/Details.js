import React, { useState, useContext } from 'react';
import { TTC, TT } from '../dev/Tooltips';
import { useConditionalEffect } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { OrmContext } from '../contexts/OrmContext';
import { ShowObject } from '../dev/ShowObject';


export function Details({metadata, field, value, item, children}) {
    const {rsStatus, store, loadItemByUniqueFields} = useContext(OrmContext);
    const [detailsId, setDetailsId] = useState();
    const property = metadata.properties[field];
    const target = property?.details;

    function fetchItem() {
        const probe = item;
        console.log(`❗ target=`, target, `probe=`, probe);
        loadItemByUniqueFields(target, probe, setDetailsId);
    }

    useConditionalEffect(fetchItem, !!target, [target]);


    return (
        <TTC>
            <ShowRequestState {...rsStatus} description={rsStatus.description + '(details) '}/>
            {children}
            {target && (
                <React.Fragment key={field + target}>
                    &nbsp;»
                    <TT style={{textAlign: "left", marginLeft: "100%", top: "0"}}>
                        <ShowObject entityName={target} data={store[target].state[detailsId]?.item}/>
                    </TT>
                </React.Fragment>
            )}
        </TTC>
    );
}
