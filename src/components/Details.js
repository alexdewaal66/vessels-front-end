import React, { useState, useContext } from 'react';
import { TTC, TT } from '../dev/Tooltips';
import { useConditionalEffect } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { StorageContext } from '../contexts/StorageContext';
import { ShowObject } from '../dev/ShowObject';
import { transform } from '../helpers/transform';


export function Details({metadata, field, value, item, children}) {
    const {rsStatus, store, loadItemByUniqueFields} = useContext(StorageContext);
    const [detailsId, setDetailsId] = useState();
    const property = metadata.properties[field];
    const target = property?.details;

    function fetchItem() {
        const probe = item;
        console.log(`❗ target=`, target, `probe=`, probe);
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
                                : store[target].state[detailsId]?.item
                            }
                        />
                    </TT>
                </React.Fragment>
            )}
        </TTC>
    );
}
