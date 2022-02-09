import React, { useContext, useState } from 'react';
import {
    createEmptyItem,
    keys,
    useBGLoading,
    useConditionalEffect,
    useKeyPressed,
    useRequestState
} from '../../helpers';
import { SummaryTable } from './';
import { CommandContext, operationNames } from '../../contexts/CommandContext';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
import { logv, pathMkr } from '../../dev/log';
import { useSet } from '../../helpers/useSet';
import { useSorting } from './UseSorting';


export function SummaryListTall({
                                    metadata, initialId, UICues,
                                    receiver,
                                    elKey
                                }) {
    elKey += '/SListTall';
    const entityName = metadata.name;
    const idName = metadata.id;
    let logRoot = `${SummaryListTall.name}(${entityName})`;
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, getItem} = storage;
    // logv(logRoot, {tree: store[entityName].state});
    const {hasFocus} = UICues;
    // logv(logRoot + ` ▶▶▶ props:`,
    //     {metadata, initialId, receiver, UICues, useFormFunctions, inputHelpFields, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const selectedIds = useSet();
    const [lastSavedItemId, setLastSavedItemId] = useState(null);

    const {handleOnKeyUp, handleOnKeyDown} = useKeyPressed(keys.control);

    const {useCommand, setCommand} = useContext(CommandContext);

    const {sort, setSorting} = useSorting(updateListTall, list);

    // logv(logRoot + ` states:`, {
    //     initialId, allIdsLoaded,
    //     'store[entityName].state': store[entityName].state,
    //     selectedIds, list
    // });
    useBGLoading(storage, metadata);


    function chooseItemTall(item) {
        const logPath = `${logRoot} » ${chooseItemTall.name}()`;
        let newSelectedIds;
        logv(logPath, {item});
        newSelectedIds = new Set([item?.[idName]]);
        selectedIds.new(newSelectedIds);
        // console.log('>>> setCommand from chooseItemTall()');
        setCommand({operation: operationNames.edit, data: item, entityType: metadata, receiver: receiver});
        // raise({operation: operationNames.edit, entityName}, item);
    }

    function updateListTall(newList, singleSelectedId) {
        const logPath = `${logRoot} » ${updateListTall.name}()`;
        logv('>>>>>>>>>>' + logPath, {newList, singleSelectedId});
        let selectedItem;
        if (newList.length === 0) {
            selectedItem = createEmptyItem(metadata);
            // logv(logPath + '|newList|=0', {selectedItem});
            newList.push(selectedItem);
            // logv(logPath, {newList});
            selectedIds.new([selectedItem[idName]]);
        } else {
            sort(newList);
            if (singleSelectedId) {
                // if (singleSelectedId < 0) logv('❌❌❌❌ ' + logPath);
                selectedItem = getItem(entityName, singleSelectedId);
                // logv(logPath + ' if (singleSelectedId)', {singleSelectedId, selectedItem});
                selectedIds.new([singleSelectedId]);//todo: obsolete line??
            } else {
                const shouldAnIdBeSelected = !!(lastSavedItemId || initialId);
                logv(null, {initialId, shouldAnIdBeSelected});
                selectedItem = shouldAnIdBeSelected
                    ? newList.find(item => item[idName] === initialId)
                    : newList[0];
                // logv(logPath, {selectedItem});
                if (selectedItem)
                    selectedIds.add(selectedItem[idName]);
            }
        }
        setList(newList);
        // logv(logPath, {selectedIds, selectedItem});
        chooseItemTall(selectedItem);
    }

    function fetchList() {
        const logPath = pathMkr(logRoot, fetchList);//`${logRoot} » ${fetchList.name}()`;
        logv(logPath, {[`store.${entityName}.state=`]: store[entityName].state});
        const entries = Object.entries(store[entityName].state);
        // logv(logPath, {entries});
        const list = entries.map(e => e[1].item);
        // logv(logPath, {list});
        updateListTall(list, (lastSavedItemId || initialId));
    }

    useConditionalEffect(
        fetchList,
        allIdsLoaded,
        [
            store[entityName].state,
            allIdsLoaded, lastSavedItemId
        ]
    );

    const conditions = {
        entityType: metadata,
        receiver: SummaryListTall.name,
        operations: {
            put: (formData) => {
                setLastSavedItemId(formData.id);
                // logv(logRoot + 'conditions.put()', {})
            },
            post: (formData) => {
                setLastSavedItemId(formData.id);
            },
            delete: () => {
                setLastSavedItemId(null);
            },
        }
    }

    useCommand(conditions);


    return (
        <div onKeyDown={handleOnKeyDown} onKeyUp={handleOnKeyUp}>
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {list && (
                <div>
                    <SummaryTable metadata={metadata}
                                  list={list}
                                  selectedIds={selectedIds}
                                  chooseItem={chooseItemTall}
                                  small={false}
                                  hasFocus={hasFocus}
                                  elKey={elKey}
                                  key={elKey}
                                  setSorting={setSorting}
                                  lastSavedItemId={lastSavedItemId}
                    />
                </div>
            )}
        </div>
    );
}

