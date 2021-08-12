import React, { useContext, useEffect, useState } from 'react';
import { getRequest, now } from '../../helpers/utils';
import { useMountEffect, useRequestState } from '../../helpers/customHooks';
import { SummaryTable } from './';
import { CommandContext, operationNames, useCommand} from '../../contexts/CommandContext';

export function SummaryList({metadata, id, small}) {
    const {endpoint} = metadata;
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const {command, setCommand} = useContext(CommandContext);

    function setItem(i) {
        setCommand({operation: operationNames.edit, data: i, entityType: metadata});
    }

    function updateList(newList, selectedId = id) {
        // console.log(now() + ` updateList() selectedId=`, selectedId);
        newList.sort((a, b) => a.id - b.id);
        setList(newList);
        const selectedItem = newList.find(item => item.id === selectedId);
        setItem(selectedItem || newList[0]);
    }

    function fetchList() {
        // console.log(now() + ' fetchList()');
        getRequest({
            url: endpoint,
            requestState: requestListState,
            onSuccess: (response) => updateList(response.data),
        })
    }

    useMountEffect(fetchList);

    const operations = {
        put: (formData) => {
            const index = list.findIndex(item => item.id === formData.id);
            console.log(now() + ` onChange.update() index=`, index);
            const newList = [...list.slice(0, index), formData, ...list.slice(index + 1)];
            updateList(newList, formData.id);
        },
        post: (formData) => {
            const newList = [...list, formData];
            updateList(newList, formData.id);
        },
        delete: (formData) => {
            const index = list.findIndex(item => item.id === formData.id);
            const newList = [...list.slice(0, index), ...list.slice(index + 1)];
            updateList(newList);
        },
    }

    useCommand(operations, command);

    return (
        <>
            {list && (
                <SummaryTable metadata={metadata}
                              list={list}
                              setItem={setItem}
                              small={small}
                />
            )}
        </>
    );
}
