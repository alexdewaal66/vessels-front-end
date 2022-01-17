import React, { useContext, useState } from 'react';
import {
    createEmptyItem,
    keys, useKeyPressed,
    useBGLoading,
    useConditionalEffect,
    useRequestState
} from '../../helpers';
import { SummaryTable } from './';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
import { logv } from '../../dev/log';
import { useSet } from '../../helpers/useSet';
import { useSorting } from './UseSorting';


export function SummaryListSmall({
                                     metadata, initialIdList, UICues,
                                     setHiddenField, elKey
                                 }) {
    elKey += '/SListSmall';
    const entityName = metadata.name;
    let logRoot = `${SummaryListSmall.name}(${entityName})`;
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, getItem} = storage;
    // logv(logRoot, {tree: store[entityName].state});
    const {hasFocus, isMulti} = UICues;

    if (!initialIdList)
        initialIdList = [0];

    // logv(logRoot + ` ▶▶▶ props:`,
    //     {metadata, initialIdList, UICues, useFormFunctions, inputHelpFields, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const selectedIds = useSet();

    const {isControlDown, handleOnControlUp, handleOnControlDown} = useKeyPressed(keys.control);

    const {sort, setSorting} = useSorting(updateListSmall, list);

    // logv(logRoot + ` states:`, {
    //     initialIdList, allIdsLoaded,
    //     'store[entityName].state': store[entityName].state,
    //     selectedIds, list
    // });
    useBGLoading(storage, metadata);

    function chooseItemSmall(item) {
        const logPath = `${logRoot} » ${chooseItemSmall.name}()`;
        let newSelectedIds;
        // logv(logPath, {item, isKeyDown: isControlDown});
        if (isMulti && isControlDown) {
            if (selectedIds.has(item.id)) {
                selectedIds.del(item.id);
            } else {
                selectedIds.add(item.id);
            }
        } else {
            newSelectedIds = new Set([item?.id || 0]);
            selectedIds.new(newSelectedIds);
        }
        setHiddenField([...newSelectedIds].toString());
    }

    function updateListSmall(newList) {
        const logPath = `${logRoot} » ${updateListSmall.name}()`;
        // logv(logPath, {newList});
        let selectedItem;
        if (newList.length === 0) {
            selectedIds.new();
            selectedItem = null;
        } else {
            sort(newList);
            const firstId = initialIdList?.[0]
            const shouldAnIdBeSelected = !!firstId;
            // logv(null, {initialIdList, shouldAnIdBeSelected});
            if (shouldAnIdBeSelected) {
                selectedItem = getItem(entityName, firstId);
                // logv( '❗❗❗' + logPath + ' » if (shouldAnIdBeSelected)',
                //     {firstId, selectedItem});
                selectedIds.add(firstId);
            } else {
                selectedItem = null;
                selectedIds.new();
            }
        }
        setList(newList);
        // logv(logPath, {selectedIds, selectedItem});
        chooseItemSmall(selectedItem);
    }


    function fetchList() {
        const logPath = logRoot + fetchList.name + '()';
        // logv(logPath, {[`store.${entityName}.state=`]: store[entityName].state});
        const entries = Object.entries(store[entityName].state);
        // logv(logPath, {entries});
        const list = entries.map(e => e[1].item);
        const nullItem = createEmptyItem(metadata);
        nullItem.id = 0;
        list.push(nullItem);
        // logv(logPath, {list});
        updateListSmall(list);
    }


    useConditionalEffect(
        fetchList,
        allIdsLoaded,
        [store[entityName].state, allIdsLoaded]
    );


    return (
        <div onKeyDown={handleOnControlDown} onKeyUp={handleOnControlUp}>
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {list && (
                <div>
                    <SummaryTable metadata={metadata}
                                  list={list}
                                  selectedIds={selectedIds}
                                  chooseItem={chooseItemSmall}
                                  small={true}
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
