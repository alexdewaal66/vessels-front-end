import React, { useState } from 'react';
import { TTC, TT } from '../dev/Tooltips';
import { findItem } from '../helpers/utils';
import { useConditionalEffect, useRequestState } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { Stringify } from '../dev/Stringify';
import { entitiesMetadata } from '../helpers/entitiesMetadata';

export function Details({metadata, field, value, children}) {
    const requestState = useRequestState();
    const [details, setDetails] = useState();
    const property = metadata.properties[field];
    const target = property?.details;

    function fetchItem() {
        // console.log(`itemRequestState.value=`, requestState.value);
        findItem({
            probe: {[field]: value},
            metadata: entitiesMetadata[target],
            requestState: requestState,
            onSuccess: response => setDetails(response.data)
        });
    }

    useConditionalEffect(fetchItem, !!target, [target]);


    return (
            <TTC>
                <ShowRequestState requestState={requestState} description={'het ophalen van details '} />
                {children}
                {target && (
                    <>
                        <TT style={{textAlign: "left", marginLeft: "100%", top: "0"}}>
                            <Stringify data={details}/>
                        </TT>
                    </>
                )}
            </TTC>
    );
}
