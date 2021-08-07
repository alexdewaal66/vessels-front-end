import React from 'react';
import { getRequest, now } from '../../helpers/utils';
import { useMountEffect, useRequestState } from '../../helpers/customHooks';
import { SummaryTable } from './';

export function SummaryList({metadata, list, updateList, updateEditForm}) {
    const {endpoint} = metadata;
    const requestListState = useRequestState();

    function fetchList() {
        // console.log(now() + ' fetchList()');
        getRequest({
            url: endpoint,
            requestState: requestListState,
            onSuccess: (response) => updateList(response.data),
        })
    }

    useMountEffect(fetchList);

    return (
        <>
            {list && (
                <SummaryTable metadata={metadata}
                              list={list}
                              setEntity={updateEditForm}
                />
            )}
        </>
    );
}
