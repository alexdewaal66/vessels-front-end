import React, { useState } from 'react';
import { TTC, TT } from '../dev/Tooltips';
import { requestStates, findItem } from '../helpers/utils';
import { useConditionalEffect, useRequestState } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { Stringify } from '../dev/Stringify';
import { entitiesMetadata } from '../helpers/entitiesMetadata';

export function Details({metadata, field, value, children}) {
    const requestState = useRequestState();
    const [oneCountry, setOneCountry] = useState();
    const property = metadata.properties[field];
    const target = property?.details;

    function fetchItem() {
        // console.log(`itemRequestState.value=`, requestState.value);
        findItem({
            probe: {[field]: value},
            metadata: entitiesMetadata[target],
            requestState: requestState,
            onSuccess: response => setOneCountry(response.data)
        });
    }

    useConditionalEffect(fetchItem, target);


    return (
            <TTC>
                {/*<ShowRequestState requestState={requestState} />*/}
                {children}
                {target && (
                    <>
                        <TT style={{textAlign: "left", marginLeft: "100%", top: "0"}}>
                            <Stringify data={oneCountry}/>
                        </TT>
                    </>
                )}
            </TTC>
    );
}
