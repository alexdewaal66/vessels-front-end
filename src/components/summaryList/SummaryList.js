import React, { useContext, useEffect, useState } from 'react';
import { getRequest, now } from '../../helpers/utils';
import { useMountEffect, useRequestState } from '../../helpers/customHooks';
import { SummaryTable } from './';
import { CommandContext, operationNames, useCommand } from '../../contexts/CommandContext';
import { createEmptyItem } from '../../helpers/entitiesMetadata';

export function SummaryList({metadata, initialId, receiver, UICues, useFormFunctions, hiddenFieldName, elKey}) {
    elKey += '/SList';
    const {small, hasFocus} = UICues;
    console.log(`▶▶▶ props=`, {metadata, initialId, receiver, UICues, useFormFunctions, hiddenFieldName, elKey});
    const {endpoint} = metadata;
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const [hasItemZero, setHasItemZero] = useState(false);
    const [preSelectedId, setPreSelectedId] = useState(initialId);
    const [selectedId, setSelectedId] = useState(initialId);
    const [command, setCommand] = useContext(CommandContext);

    function editItem(item) {
        // console.log(`editItem() item.id=`, item.id);
        setSelectedId(item.id);
        if (hiddenFieldName) {
            if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
                // console.log('>>> setValue');
                useFormFunctions.setValue(hiddenFieldName, item.id);
            } else {
                const idList = useFormFunctions.getValues(hiddenFieldName).split(',');
                if (!idList.includes(item.id.toString())) {
                    idList.push(item.id.toString());
                    useFormFunctions.setValue(hiddenFieldName, idList.join());
                }
            }
        } else {
            // console.log('>>> setCommand from');
            setCommand({operation: operationNames.edit, data: item, entityType: metadata, receiver: receiver});
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (preSelectedId !== initialId) {
            setSelectedId(initialId);
            setPreSelectedId(initialId);
        }
    })

    function updateList(newList = list, newSelectedId = selectedId ?? initialId) {
        if (newList.length === 0) {
            const item = createEmptyItem(metadata);
            // console.log(`----------item=`, item);
            newList.push(item);
            // console.log(`-----------newList=`, newList);
            setHasItemZero(true);
        } else if (hasItemZero){
            const itemZeroIndex = newList.findIndex(item => item.id === 0 );
            if (itemZeroIndex !== -1) {
                newList.splice(itemZeroIndex, 1);
                setHasItemZero(false);
            }
        }
        // console.log(now() + ` updateList() selectedId=`, selectedId);
        newList.sort((a, b) => a.id - b.id);
        setList(newList);
        setSelectedId(newSelectedId);
        const selectedItem = newList.find(item => item.id === newSelectedId);
        editItem(selectedItem ?? newList[0]);
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

    const conditions = {
        entityType: metadata,
        receiver: 'SummaryList',
        operations: {
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
    }

    useCommand(conditions, command);

    return (
        <>
            {list && (
                <div>
                    {/*<div>SL: selectedId={selectedId} ; initialId={initialId}</div>*/}
                    <SummaryTable metadata={metadata}
                                  list={list}
                                  selectedId={selectedId}
                                  selectItem={editItem}
                                  small={small}
                                  hasFocus={hasFocus}
                                  elKey={elKey}
                                  key={elKey}
                        // elKey={elKey+selectedId}
                        // key={elKey+selectedId}
                    />
                </div>
            )}
        </>
    );
}
