import React, { useContext, useState } from 'react';
import {
    createEmptyItem,
    keys, useKeyPressed,
    useLoading,
    useConditionalEffect,
    useRequestState, entityTypes,
} from '../../helpers';
import { SummaryTable, useSorting } from './';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts';
import { useImmutableSet } from '../../helpers';
// import { logv, pathMkr, rootMkr } from '../../dev/log';
import { Stringify } from '../../dev/Stringify';
import { Patience } from '../Patience';

export const optionalIdValue = -Infinity;

export function SummaryListSmall({
                                     entityType, initialIdList, UICues,
                                     setHiddenField, elKey
                                 }) {
    elKey += '/SListSmall';
    const entityName = entityType.name;
    // const logRoot = rootMkr(SummaryListSmall, entityName, '↓↓');
    const storage = useContext(StorageContext);
    const {isAllLoaded, store, getItem} = storage;
    // logv(logRoot, {tree: store[entityName].state});
    const {isMulti, hasNull, readOnly} = UICues;

    if (!initialIdList)
        initialIdList = [0];

    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const selectedIds = useImmutableSet();

    const {isControlDown, handleOnControlUp, handleOnControlDown} = useKeyPressed(keys.control);

    const sorting = useSorting(updateListSmall, list, entityType);

    // logv(logRoot + ` states:`, {
    //     initialId, isAllLoaded,
    //     'store[entityName].state': store[entityName].state,
    //     selectedIds, list
    // });
    useLoading(storage, entityType);

    // useLoading(storage, entityType);

    async function chooseItemSmall(item) {
        // const logPath = pathMkr(logRoot, chooseItemSmall);
        let newSelectedIds;
        // logv(logPath, {item, isKeyDown: isControlDown});
        if (item?.id === optionalIdValue) {
            const blankItem = createEmptyItem(entityTypes, entityType);
            await storage.newItem(entityType.name, blankItem,
                (savedItem) => {
                    item = savedItem;
                    // logv(logPath, {item});
                });
        }
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
        // logv(logPath, {newSelectedIds});
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
            sorting.sort(newList);
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
            const nullItem = createEmptyItem(entityTypes, entityType);
            nullItem.id = 0;
            list.push(nullItem);
        }
        if (!readOnly){
            const optionalItem = createEmptyItem(entityTypes, entityType);
            optionalItem.id = optionalIdValue;
            list.push(optionalItem);
        }
        // logv(logPath, {list});
        updateListSmall(list);
    }


    useConditionalEffect(
        makeList,
        isAllLoaded,
        [store[entityName].state, isAllLoaded]
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
                                  sorting={sorting}
                    />
                </div>
            )}
            {!list && <Patience>, lijst wordt opgebouwd.</Patience>}
        </div>
    );
}
