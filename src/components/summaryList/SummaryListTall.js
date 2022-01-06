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
import { logv } from '../../dev/log';
import { useSet } from '../../helpers/useSet';
import { useSorting } from './UseSorting';


export function SummaryListTall({
                                    metadata, initialIdList, UICues,
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
    //     {metadata, initialIdList, receiver, UICues, useFormFunctions, inputHelpFields, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const selectedIds = useSet();

    const {handleOnKeyUp, handleOnKeyDown} = useKeyPressed(keys.control);

    const {useCommand, setCommand} = useContext(CommandContext);

    const {sort, setSorting} = useSorting(updateListTall, list);

    // logv(logRoot + ` states:`, {
    //     initialIdList, allIdsLoaded,
    //     'store[entityName].state': store[entityName].state,
    //     selectedIds, list
    // });
    useBGLoading(storage, metadata);


    function chooseItemTall(item) {
        const logPath = `${logRoot} » ${chooseItemTall.name}()`;
        let newSelectedIds;
        // logv(logPath, {item, isKeyDown});
        newSelectedIds = new Set([item?.[idName]]);
        selectedIds.new(newSelectedIds);
        // console.log('>>> setCommand from chooseItemTall()');
        setCommand({operation: operationNames.edit, data: item, entityType: metadata, receiver: receiver});
        // raise({operation: operationNames.edit, entityName}, item);
    }

    function updateListTall(newList, singleSelectedId) {
        const logPath = `${logRoot} » ${updateListTall.name}()`;
        // logv(logPath, {newList, singleSelectedId});
        let selectedItem;
        if (newList.length === 0) {
            selectedItem = createEmptyItem(metadata);
            // logv(logPath + '|newList|=0', {selectedItem});
            newList.push(selectedItem);
            // logv(logPath,  {newList});
            selectedIds.new([selectedItem[idName]]);
        } else {
            sort(newList);
            if (singleSelectedId) {
                // if (singleSelectedId < 0) logv('❌❌❌❌ ' + logPath);
                selectedItem = getItem(entityName, singleSelectedId);
                // logv(logPath + ' if (singleSelectedId)', {selectedItem});
                selectedIds.new([singleSelectedId]);
            } else {
                const shouldAnIdBeSelected = !!(initialIdList?.[0]);
                // logv(null, {initialIdList, shouldAnIdBeSelected});
                selectedItem = shouldAnIdBeSelected
                    ? newList.find(item => item[idName] === initialIdList[0])
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
        const logPath = logRoot + fetchList.name + '()';
        // logv(logPath, {[`store.${entityName}.state=`]: store[entityName].state});
        const entries = Object.entries(store[entityName].state);
        // logv(logPath, {entries});
        const list = entries.map(e => e[1].item);
        // logv(logPath, {list});
        updateListTall(list, null);
    }


    useConditionalEffect(
        fetchList,
        allIdsLoaded,
        [store[entityName].state, allIdsLoaded]
    );

    const conditions = {
        entityType: metadata,
        receiver: SummaryListTall.name,
        operations: {
            put: (formData) => {
                // const id = ;
                const index = list.findIndex(item => item[idName] === formData.id);
                const newList = [...list.slice(0, index), formData, ...list.slice(index + 1)];
                // logv(logRoot + ' » conditions.put()', {id, index, newList});
                updateListTall(newList, formData.id);
            },
            post: (formData) => {
                updateListTall(list, formData.id);
            },
            delete: (formData) => {
                const index = list.findIndex(item => item[idName] === formData.id);
                const newList = [...list.slice(0, index), ...list.slice(index + 1)];
                updateListTall(newList, null);
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
                    />
                </div>
            )}
        </div>
    );
}

