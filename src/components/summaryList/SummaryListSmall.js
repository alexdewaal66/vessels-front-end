import React, { useContext, useState } from 'react';
import {
    createEmptyItem,
    keys, useKeyPressed,
    useLoading,
    useConditionalEffect,
    useRequestState,
} from '../../helpers';
import { SummaryTable } from './';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts';
import { useImmutableSet } from '../../helpers';
import { useSorting } from './useSorting';
import { logv, pathMkr, rootMkr } from '../../dev';
import { Stringify } from '../../dev';
import { Patience } from '../Patience';


export function SummaryListSmall({
                                     entityType, initialIdList, UICues,
                                     setHiddenField, elKey
                                 }) {
    elKey += '/SListSmall';
    const entityName = entityType.name;
    const logRoot = rootMkr(SummaryListSmall, entityName, '↓↓');
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, getItem} = storage;
    // logv(logRoot, {tree: store[entityName].state});
    const {isMulti, hasNull} = UICues;

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
    useLoading(storage, entityType);
    // useLoading(storage, entityType);

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
            const nullItem = createEmptyItem(entityType);
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
                    <SummaryTable entityType={entityType}
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
            {!list && <Patience>, lijst wordt opgebouwd.</Patience>}
        </div>
    );
}
