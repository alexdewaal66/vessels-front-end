import React, { useContext, useEffect, useState } from 'react';
import {
    createEmptyItem,
    keys, useKeyPressed,
    useBGLoading,
    useLoading,
    useConditionalEffect,
    useRequestState, useMountEffect
} from '../../helpers';
import { SummaryTable } from './';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
import { useImmutableSet } from '../../helpers/useImmutableSet';
import { useSorting } from './UseSorting';
import { logv, pathMkr, rootMkr } from '../../dev/log';
import { Stringify } from '../../dev/Stringify';


export function SummaryListSmall({
                                     metadata, initialIdList, UICues,
                                     setHiddenField, elKey
                                 }) {
    elKey += '/SListSmall';
    const entityName = metadata.name;
    const logRoot = rootMkr(SummaryListSmall, entityName, '↓↓');
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, getItem} = storage;
    // logv(logRoot, {tree: store[entityName].state});
    const {hasFocus, isMulti, hasNull} = UICues;

    if (!initialIdList)
        initialIdList = [0];

    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const selectedIds = useImmutableSet();

    const {isControlDown, handleOnControlUp, handleOnControlDown} = useKeyPressed(keys.control);

    const {sort, setSorting} = useSorting(updateListSmall, list);

    // logv(logRoot + ` states:`, {
    //     initialId, allIdsLoaded,
    //     'store[entityName].state': store[entityName].state,
    //     selectedIds, list
    // });
    useLoading(storage, metadata);
    // useLoading(storage, metadata);

    function chooseItemSmall(item) {
        const logPath = pathMkr(logRoot, chooseItemSmall);
        let newSelectedIds;
        // logv(logPath, {item, isKeyDown: isControlDown});
        if (isMulti && isControlDown) {
            newSelectedIds = selectedIds.toggle(item.id);
            // if (selectedIds.has(item.id)) {
            //     selectedIds.del(item.id);
            // } else {
            //     selectedIds.add(item.id);
            // }
        } else {
            // newSelectedIds = new Set([item?.id || 0]);
            // selectedIds.new(newSelectedIds);
            newSelectedIds = selectedIds.new([item?.id || 0]);
        }
        logv(logPath, {newSelectedIds});
        setHiddenField([...newSelectedIds].toString());
    }

    function updateListSmall(newList) {
        // const logPath = pathMkr(logRoot, updateListSmall);
        // logv(logPath, {newList});
        let selectedItem;
        if (newList.length === 0) {
            selectedIds.new();
            selectedItem = null;
        } else {
            sort(newList);
            const firstId = initialIdList?.[0]
            const shouldAnIdBeSelected = !!firstId;
            // logv(null, {initialId, shouldAnIdBeSelected});
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


    function makeList() {
        // const logPath = pathMkr(logRoot, makeList);
        // logv(logPath, {[`store.${entityName}.state=`]: store[entityName].state});
        const entries = Object.entries(store[entityName].state);
        // logv(logPath, {entries});
        const list = entries.map(e => e[1].item);
        if (hasNull) {
            const nullItem = createEmptyItem(metadata);
            nullItem.id = 0;
            list.push(nullItem);
        }
        // logv(logPath, {list});
        updateListSmall(list);
    }


    useConditionalEffect(
        makeList,
        allIdsLoaded,
        [store[entityName].state, allIdsLoaded]
    );


    return (
        <div onKeyDown={handleOnControlDown} onKeyUp={handleOnControlUp}>
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {list && (
                <div>
                    {isMulti && (
                        <Stringify data={[...selectedIds.all]}>selectedIds</Stringify>
                    )}
                    <SummaryTable metadata={metadata}
                                  list={list}
                                  selectedIds={selectedIds}
                                  chooseItem={chooseItemSmall}
                                  small={true}
                                  UICues={UICues}
                                  elKey={elKey}
                                  key={elKey}
                                  setSorting={setSorting}
                    />
                </div>
            )}
        </div>
    );
}
