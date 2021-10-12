import React, { useContext, useEffect, useState } from 'react';
import { now } from '../../helpers/utils';
import { useConditionalEffect, useRequestState } from '../../helpers/customHooks';
import { SummaryTable } from './';
import { CommandContext, operationNames, useCommand } from '../../contexts/CommandContext';
import { createEmptyItem } from '../../helpers/entitiesMetadata';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
import { useBGLoading } from '../../helpers/useBGLoading';

export function SummaryList({
                                metadata, initialId, receiver, UICues,
                                useFormFunctions, inputHelpFields, elKey
                            }) {
    //TODO❗❗ GEEN RIJ SELECTEREN BINNEN EEN INPUT ALS VERWIJZING NULL IS, IS NU RIJ 1
    elKey += '/SList';
    const entityName = metadata.name;
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, loadItemsByIds} = storage;
    const {small, hasFocus} = UICues;
    // console.log(`▶▶▶ props=`, {metadata, initialId, receiver, UICues, useFormFunctions, hiddenFieldName, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const [preSelectedId, setPreSelectedId] = useState(initialId);
    const [selectedId, setSelectedId] = useState(initialId);
    const [command, setCommand] = useContext(CommandContext);

    console.log(`SummaryList(${metadata.name}) \n\t list=`, list);
    useBGLoading(storage, metadata);

    function editItem(item) {
        console.log(now() + `\n SummaryList(${entityName}) » editItem() \n\t item.id=`, item.id);
        setSelectedId(item?.id);
        if (inputHelpFields) {
            const [hiddenFieldName, nullFieldName] = inputHelpFields;
            useFormFunctions.setValue(nullFieldName, false);
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
    useEffect(function whyIsThisNotSuperfluous() {
        if (preSelectedId !== initialId) {
            setSelectedId(initialId);
            setPreSelectedId(initialId);
        }
    })

    function updateList(newList = list, newSelectedId = selectedId ?? initialId) {
        // console.log(now() + ` SummaryList(${entityName}) » updateList() \n\t newList=`, newList);

        if (newList.length === 0) {
            const item = createEmptyItem(metadata);
            // console.log(now() + `SummaryList » updateList() \n\t item=`, item);
            newList.push(item);
            newSelectedId = 0;
        }
        // console.log(now() + `SummaryList »  updateList() \n\t selectedId=`, selectedId);
        newList.sort((a, b) => a.id - b.id);
        setList(newList);
        setSelectedId(newSelectedId);
        const selectedItem = newList.find(item => item.id === newSelectedId);
        editItem(selectedItem ?? newList[0]);
    }

    function fetchList() {
        console.log(now() + ' fetchList()');
        // console.log(`SummaryList » fetchList() \n\t store[${entityName}].state=`, store[entityName].state);
        const entries = Object.entries(store[entityName].state);
        // console.log(`SummaryList » fetchList() \n\t entries=`, entries);
        const list = entries.map(e => e[1].item);
        // console.log(`SummaryList » fetchList() \n\t list=`, list);
        updateList(list);
    }

    // console.log(`❗❗ entityName=`, entityName);
    useConditionalEffect(fetchList, allIdsLoaded, [store[entityName].state]);


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
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {/*<Stringify data={store[entityName].state}>{entityName}</Stringify>*/}
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
