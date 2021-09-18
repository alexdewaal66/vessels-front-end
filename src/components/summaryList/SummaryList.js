import React, { useContext, useEffect, useState } from 'react';
import { getRequest, now } from '../../helpers/utils';
import { useConditionalEffect, useMountEffect, useRequestState } from '../../helpers/customHooks';
import { SummaryTable } from './';
import { CommandContext, operationNames, useCommand } from '../../contexts/CommandContext';
import { createEmptyItem } from '../../helpers/entitiesMetadata';
import { ShowRequestState } from '../ShowRequestState';
import { OrmContext } from '../../contexts/OrmContext';
import { Stringify } from '../../dev/Stringify';
import { validities, itemStates } from '../../helpers/useStorage';

export function SummaryList({
                                metadata, initialId, receiver, UICues,
                                useFormFunctions, hiddenFieldName, elKey
                            }) {
    elKey += '/SList';
    const entityName = metadata.name;
    const {allIdsLoaded, store, rsStatus, loadItemsByIds}
        = useContext(OrmContext);
    const {small, hasFocus} = UICues;
    // console.log(`▶▶▶ props=`, {metadata, initialId, receiver, UICues, useFormFunctions, hiddenFieldName, elKey});
    // const {endpoint} = metadata;
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const [hasItemZero, setHasItemZero] = useState(false);
    const [preSelectedId, setPreSelectedId] = useState(initialId);
    const [selectedId, setSelectedId] = useState(initialId);
    const [command, setCommand] = useContext(CommandContext);
    const [focusIndexCopy, setFocusIndexCopy] = useState();

    const [loadCntr, setLoadCntr] = useState(0);
    const [pendingBlocks, setPendingBlocks] = useState([]);

    function setSingleBlock(index, value) {
        setPendingBlocks( currentBlocks =>
            [...currentBlocks.slice(0, index), value, ...currentBlocks.slice(index+1)])
    }

    console.log(`SummaryList \nloadCntr=`, loadCntr, `\npendingBlocks=`, pendingBlocks);

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
        } else if (hasItemZero) {
            const itemZeroIndex = newList.findIndex(item => item.id === 0);
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
        console.log(now() + ' fetchList()');
        // getRequest({
        //     url: endpoint,
        //     requestState: requestListState,
        //     onSuccess: (response) => updateList(response.data),
        // })
        // console.log(`SummaryList » fetchList() \nstore[${metadata.name}].state=`, store[metadata.name].state);
        const entries = Object.entries(store[metadata.name].state);
        // console.log(`SummaryList » fetchList() \nentries=`, entries);
        const list = entries.map(e => e[1].item);
        // console.log(`SummaryList » fetchList() \nlist=`, list);
        updateList(list);
    }

    useConditionalEffect(fetchList, allIdsLoaded, [store[metadata.name].state]);


    // function loadItemsNearSelectedId() {
    //     const selectedIndex = Math.max(list.findIndex(item => item.id === selectedId), 0);
    //     const startIndex = Math.max(0, selectedIndex - 50);
    //     const endIndex   = Math.min( selectedIndex + 50, list.length);
    //     const nearIds = list.slice(startIndex, endIndex).map(e => e.id);
    //     loadItemsByIds(entityName, nearIds);
    // }
    // useConditionalEffect(loadItemsNearSelectedId, !!selectedId ,[selectedId]);
    //
    //
    // function loadItemsNearFocusIndex() {
    //     const startIndex = Math.max(0, focusIndexCopy - 50);
    //     const endIndex   = Math.min( focusIndexCopy + 50, list.length);
    //     const nearIds = list.slice(startIndex, endIndex).map(e => e.id);
    //     console.log(`nearIds=`, nearIds);
    //     loadItemsByIds(entityName, nearIds);
    // }
    // useConditionalEffect(loadItemsNearFocusIndex, !!focusIndexCopy ,[focusIndexCopy]);


    function loadUnloadedItems() {
        const blockSize = 50;
        const tree = store[metadata.name];

        if (pendingBlocks.length === 0) {
            const blockCount = Math.ceil(Object.entries(tree.state).length / blockSize);
            setPendingBlocks(Array(blockCount).fill(false));
            return;
        }
        if (loadCntr > 5) return;

        const unloadedFilter = (entry) => {
            const val = entry[1].validity === validities.id;
            const bNr = Math.floor(parseInt(entry[0]) / blockSize);
            const pb = pendingBlocks[bNr];
            // console.log(`unloadedFilter() \nval=`, val, `\nbNr=`, bNr, `\npb=`, pb);
            return val && !pb;
        };

        const entries = Object.entries(tree.state);
        console.log(`SummaryList » loadUnloadedItems()\n\tentries=`, entries, `\n\tpendingBlocks=`, pendingBlocks);
        const first = entries.findIndex(unloadedFilter);
        console.log(`SummaryList » loadUnloadedItems()\nfirst=`, first);
        if (first === -1) return;

        const unloaded = entries.slice(first, first + blockSize).filter(unloadedFilter);
        // console.log(`SummaryList » loadUnloadedItems()\nunloaded=`, unloaded);
        if (unloaded.length > 0) {
            const endIndex = Math.min(blockSize, unloaded.length);
            const unloadedIds = unloaded.slice(0, endIndex).map(e => e[1].item.id);
            console.log(`SummaryList » loadUnloadedItems()\n\tunloadedIds=`, unloadedIds);
            setLoadCntr(c => c + 1);
            // set the block to be loaded as 'pending'
            const currentBlockNr = Math.floor(parseInt(entries[first][0]) / blockSize);
            // console.log(`entries[first]=`, entries[first]);
            // console.log(`currentBlockNr=`, currentBlockNr);
            setSingleBlock(currentBlockNr, true);
            loadItemsByIds(entityName, unloadedIds, () => {
                setLoadCntr(c => c - 1);
                console.log(`setFinished() before set`,
                    `\n\tcurrentBlockNr=`, currentBlockNr,
                    `\n\tpendingBlocks=`, pendingBlocks);
                setSingleBlock(currentBlockNr, false);
                console.log(`setFinished() after set`,
                    `\n\tcurrentBlockNr=`, currentBlockNr,
                    `\n\tpendingBlocks=`, pendingBlocks);
            });
        }
    }

    useConditionalEffect(
        loadUnloadedItems,
        (loadCntr < 5),
        [loadCntr, pendingBlocks]
    );


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
            {/*<Stringify data={store[entityName].state}>*/}
            {/*    {entityName}*/}
            {/*</Stringify>*/}
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
                                  setFocusIndexCopy={setFocusIndexCopy}
                        // elKey={elKey+selectedId}
                        // key={elKey+selectedId}
                    />
                </div>
            )}
        </>
    );
}
