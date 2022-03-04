import React, { useContext, useState } from 'react';
import {
    createEmptyItem,
    keys,
    useBGLoading,
    useLoading,
    useConditionalEffect,
    useKeyPressed,
    useRequestState
} from '../../helpers';
import { SummaryTable } from './';
import { CommandContext, operationNames } from '../../contexts/CommandContext';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
import { useImmutableSet } from '../../helpers/useImmutableSet';
import { useSorting } from './UseSorting';
import { logv, pathMkr, rootMkr } from '../../dev/log';
import { useRenderCounter } from '../../dev/useRenderCounter';


export function SummaryListTall({
                                    entityType, initialId, UICues,
                                    receiver,
                                    elKey
                                }) {
    elKey += '/SListTall';
    const entityName = entityType.name;
    const idName = entityType.id;
    const logRoot = rootMkr(SummaryListTall, entityName);
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, getItem} = storage;
    // logv(logRoot, {tree: store[entityName].state});
    // logv(logRoot + ` ▶▶▶ props:`,
    //     {entityType, initialId, receiver, UICues, useFormFunctions, inputHelpFields, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const selectedIds = useImmutableSet();
    const [lastSavedItemId, setLastSavedItemId] = useState(null);

    const {handleOnKeyUp, handleOnKeyDown} = useKeyPressed(keys.control);

    const {useCommand, setCommand} = useContext(CommandContext);

    const {sort, setSorting} = useSorting(updateListTall, list);

    // logv(logRoot + ` states:`, {
    //     initialId, allIdsLoaded,
    //     'store[entityName].state': store[entityName].state,
    //     selectedIds, list
    // });
    const intervalCounter = useLoading(storage, entityName);


    const renderCount = useRenderCounter();


    function chooseItemTall(item) {
        // const logPath = `${logRoot} » ${chooseItemTall.name}()`;
        // logv(logPath, {item});
        selectedIds.new([item?.[idName]]);
        // console.log('>>> setCommand from chooseItemTall()');
        setCommand({operation: operationNames.edit, data: item, entityType: entityType, receiver: receiver});
        // raise({operation: operationNames.edit, entityName}, item);
    }

    function updateListTall(newList, singleSelectedId) {
        const logPath = pathMkr(logRoot, updateListTall);
        // logv(logPath, {newList, singleSelectedId});
        let selectedItem;
        if (newList.length === 0) {
            selectedItem = createEmptyItem(entityType);
            // logv(logPath + '|newList|≡0', {selectedItem});
            newList.push(selectedItem);
            // logv(logPath, {newList});
            selectedIds.new([selectedItem[idName]]);
        } else {
            sort(newList);
            if (singleSelectedId) {
                // if (singleSelectedId < 0) logv(null, {singleSelectedId}, '< 0');
                if (!allIdsLoaded) logv('❌❌❌❌' + logPath, {allIdsLoaded, newList});
                selectedItem = getItem(entityName, singleSelectedId);
                // logv(null, {singleSelectedId, selectedItem}, '!!');
                selectedIds.new([singleSelectedId]);//todo: obsolete line??
            } else {
                const shouldAnIdBeSelected = !!(lastSavedItemId || initialId);
                // logv(null, {singleSelectedId, initialId, shouldAnIdBeSelected}, '!');
                selectedItem = shouldAnIdBeSelected
                    ? newList.find(item => item[idName] === initialId)
                    : newList[0];
                // logv(null, {selectedItem});
                if (selectedItem)
                    selectedIds.add(selectedItem[idName]);
            }
        }
        setList(newList);
        // logv(null, {selectedIds, selectedItem});
        chooseItemTall(selectedItem);
    }

    function makeList() {
        // const logPath = pathMkr(logRoot, makeList);
        // logv(logPath, {[`store.${entityName}.state=`]: store[entityName].state});
        const entries = Object.entries(store[entityName].state);
        // logv(null, {entries});
        const list = entries.map(e => e[1].item);
        // logv(null, {list});
        updateListTall(list, (lastSavedItemId || initialId));
    }

    useConditionalEffect(
        makeList,
        allIdsLoaded,
        [
            store[entityName].state,
            allIdsLoaded, lastSavedItemId
        ]
    );

    const conditions = {
        entityType: entityType,
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
            {renderCount}
            <br/>
            intervalCounter={intervalCounter}
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {list && (
                <div>
                    <SummaryTable entityType={entityType}
                                  list={list}
                                  selectedIds={selectedIds}
                                  chooseItem={chooseItemTall}
                                  small={false}
                                  UICues={UICues}
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

