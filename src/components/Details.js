import React, { useState, useContext } from 'react';
import { TTC, TT } from '../dev/Tooltips';
import { findItem } from '../helpers/utils';
import { useConditionalEffect, useRequestState } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { Stringify } from '../dev/Stringify';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { OrmContext } from '../contexts/OrmContext';


export function Details({metadata, field, value, children}) {
    const { store, loadItemByUniqueFields } = useContext(OrmContext);
    const requestState = useRequestState();
    const [detailsId, setDetailsId] = useState();
    const property = metadata.properties[field];
    const target = property?.details;

    function fetchItem() {
        // console.log(`itemRequestState.value=`, requestState.value);
        // findItem(
        //     entitiesMetadata[target],
        //     {[field]: value},
        //     requestState,
        //     response => setDetailsId(response.data)
        // );
        const probe = {[field]: value};
        console.log(`❗ target=`, target, `probe=`, probe);
        loadItemByUniqueFields(target, probe, setDetailsId);
    }

    useConditionalEffect(fetchItem, !!target, [target]);


    return (
            <TTC>
                <ShowRequestState requestState={requestState} description={'het ophalen van details '} />
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
