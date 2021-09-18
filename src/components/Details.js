import React, { useState, useContext } from 'react';
import { TTC, TT } from '../dev/Tooltips';
import { useConditionalEffect } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { Stringify } from '../dev/Stringify';
import { OrmContext } from '../contexts/OrmContext';


export function Details({metadata, field, value, children}) {
    const {rsStatus, store, loadItemByUniqueFields } = useContext(OrmContext);
    const [detailsId, setDetailsId] = useState();
    const property = metadata.properties[field];
    const target = property?.details;

    function fetchItem() {
        const probe = {[field]: value};
        console.log(`❗ target=`, target, `probe=`, probe);
        loadItemByUniqueFields(target, probe, setDetailsId);
    }

    useConditionalEffect(fetchItem, !!target, [target]);


    return (
            <TTC>
                <ShowRequestState {...rsStatus} description={rsStatus.description + '(details) '} />
                {children}
                {target && (
                    <>
                        <TT style={{textAlign: "left", marginLeft: "100%", top: "0"}}>
                            <Stringify data={store[target].state[detailsId]}/>
                        </TT>
                    </>
                )}
            </TTC>
    );
}
