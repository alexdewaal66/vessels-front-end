import React, { useContext, useEffect, useState } from 'react';
import { createEmptyItem } from '../../helpers/entityTypes';
import { keys, useKeyPressed, useConditionalEffect, useRequestState } from '../../helpers/customHooks';
import { usePollBackEndForChanges } from '../../helpers/usePollBackEndForChanges';
import { entityTypes } from '../../helpers/entityTypes';
import { SummaryTable, useSorting } from './';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts';
import { useImmutableSet } from '../../helpers/useImmutableSet';
import { logConditionally, logv, pathMkr, rootMkr } from '../../dev/log';
import { Stringify } from '../../dev/Stringify';
import { Patience } from '../Patience';
import { useLoggingState } from '../../dev/useLoggingState';
import { useCounter } from '../../dev/useCounter';
import { Sorry } from '../../dev/Sorry';
import { useLoggingImmutableSet } from '../../dev/useLoggingImmutableSet';
import { useLoggingConditionalEffect } from '../../dev/useLoggingEffect';
import { language } from '../../helpers';

const messages = {
    NL: {
        rsDesc: 'het ophalen van de lijst ',
        building: 'lijst wordt opgebouwd.',
    },
    EN: {
        rsDesc: 'fetching the list ',
        building: 'building list.',
    }
};


export const optionalIdValue = -Infinity;

export function SummaryListSmall({
                                     entityType, initialIdList, UICues,
                                     setHiddenField, elKey
                                 }) {
    elKey += '/SListSmall';
    if (!entityType) logv(rootMkr(SummaryListSmall), {elKey}, '❌');
    const entityName = entityType.name;
    const logRoot = rootMkr(SummaryListSmall, entityName, '↓↓');
    const doLog = logConditionally(entityName);
    const storage = useContext(StorageContext);
    const {isAllLoaded, store} = storage;
    if (doLog) logv(logRoot, {vars: {[entityName + 's']: storage.getEntries(entityName)}});
    const {isMulti, hasNull, readOnly} = UICues;


    // const counter = useCounter(logRoot, entityName, 100);//todo remove

    const TXT = messages[language()];

    if (!initialIdList)
        initialIdList = [0];

    const requestListState = useRequestState();
    const [list, setList] = useLoggingState(null, 'list', logRoot, entityName);
    const selectedIds = useLoggingImmutableSet(null, 'selectedIds', logRoot, entityName);

    const {isControlDown, handleOnControlUp, handleOnControlDown} = useKeyPressed(keys.control);

    const sorting = useSorting(updateListSmall, list, entityType);

    if (doLog) logv(logRoot + ` states:`, {
        initialIdList, isAllLoaded,
        selectedIds, list
    });
    usePollBackEndForChanges(storage, entityName);


    async function chooseItemSmall(item) {
        const logPath = pathMkr(logRoot, chooseItemSmall);
        let newSelectedIds;
        if (doLog) logv(logPath, {item, isKeyDown: isControlDown});
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
        const logPath = pathMkr(logRoot, updateListSmall);
        // logv(logPath, {newList, renderCount: counter.value});
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
                selectedItem = storage.getItem(entityName, firstId);
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
        const logPath = pathMkr(logRoot, makeList);
        // logv(logPath, {[`store.${entityName}=`]: store[entityName], renderCount: counter.value});
        const entries = Object.entries(storage.getEntries(entityName));
        // logv(logPath, {entries});
        const list = entries.map(e => e[1].item);
        if (hasNull) {
            const nullItem = createEmptyItem(entityTypes, entityType);
            nullItem.id = 0;
            list.push(nullItem);
        }
        if (!readOnly) {
            const optionalItem = createEmptyItem(entityTypes, entityType);
            optionalItem.id = optionalIdValue;
            list.push(optionalItem);
        }
        // logv(logPath, {list});
        updateListSmall(list);
    }

    useEffect(makeList, [storage.getEntries(entityName), isAllLoaded]);

    // if (counter.passed) return <Sorry context={SummaryListSmall.name} count={counter.value}/>;//todo remove

    return (
        <div onKeyDown={handleOnControlDown} onKeyUp={handleOnControlUp} style={{minHeight: '12em'}}>
            <ShowRequestState requestState={requestListState} description={TXT.rsDesc}/>
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
            {!list && <Patience>, {TXT.building}</Patience>}
        </div>
    );
}
