import React, { useContext, useState } from 'react';
import {
    keys, useKeyPressed,
    usePollBackEndForChanges,
    useConditionalEffect,
    useRequestState, languageSelector
} from '../../helpers';
import { entityTypes, createEmptyItem } from '../../helpers/globals/entityTypes';
import { SummaryTable, useSorting } from './';
import { CommandContext, operationNames } from '../../contexts';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts';
import { useImmutableSet } from '../../helpers';
import { logCondition, logv, pathMkr, rootMkr } from '../../dev/log';
import { Patience } from '../Patience';

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


export function SummaryListTall({
                                    entityType, initialId, UICues,
                                    receiver,
                                    elKey
                                }) {
    elKey += '/SListTall';
    const entityName = entityType.name;
    const logRoot = rootMkr(SummaryListTall, entityName);
    const doLog = logCondition(SummaryListTall, entityName);
    const storage = useContext(StorageContext);
    const entityEntries = storage.getEntries(entityName)
    const {isAllLoaded, getItem} = storage;
    if (doLog) logv(logRoot + ' props:',
        {entityType, initialId, receiver, UICues, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const selectedIds = useImmutableSet();
    const [lastSavedItemId, setLastSavedItemId] = useState(null);

    const {handleOnKeyUp, handleOnKeyDown} = useKeyPressed(keys.control);

    const {useCommand, setCommand} = useContext(CommandContext);

    const sorting = useSorting(updateListTall, list, entityType);

    const TXT = messages[languageSelector()];

    if (doLog) logv(logRoot + ` states:`, {initialId, isAllLoaded, selectedIds, list});
    usePollBackEndForChanges(storage, entityName);


    function chooseItemTall(item) {
        // const logPath = `${logRoot} » ${chooseItemTall.name}()`;
        // logv(logPath, {item});
        selectedIds.new([item?.id]);
        // console.log('>>> setCommand from chooseItemTall()');
        setCommand({operation: operationNames.edit, data: item, entityType: entityType, receiver: receiver});
        // raise({operation: operationNames.edit, entityName}, item);
    }

    function updateListTall(newList, singleSelectedId) {
        const logPath = pathMkr(logRoot, updateListTall);
        // logv(logPath, {newList, singleSelectedId});
        let selectedItem;
        if (newList.length === 0) {
            selectedItem = createEmptyItem(entityTypes, entityType);
            // logv(logPath + '|newList|≡0', {selectedItem});
            newList.push(selectedItem);
            // logv(logPath, {newList});
            selectedIds.new([selectedItem.id]);
        } else {
            sorting.sort(newList);
            if (singleSelectedId != null) {
                if (singleSelectedId === 0) singleSelectedId = newList[0].id;
                if (doLog) logv(logPath, {newList, singleSelectedId, type_ssId: typeof singleSelectedId}, '👀👀👀');
                // if (singleSelectedId < 0) logv(null, {singleSelectedId}, '< 0');
                if (!isAllLoaded) logv('❌❌❌❌' + logPath, {isAllLoaded, newList});
                selectedItem = getItem(entityName, singleSelectedId);
                // logv(null, {singleSelectedId, selectedItem}, '!!');
                selectedIds.new([singleSelectedId]);//todo: obsolete line??
            } else {
                const shouldAnIdBeSelected = !!(lastSavedItemId || initialId);
                // logv(null, {singleSelectedId, initialId, shouldAnIdBeSelected}, '!');
                selectedItem = shouldAnIdBeSelected
                    ? newList.find(item => item.id === initialId)
                    : newList[0];
                logv(logPath, {selectedItem});
                if (selectedItem)
                    selectedIds.add(selectedItem.id);
            }
        }
        setList(newList);
        // logv(null, {selectedIds, selectedItem});
        chooseItemTall(selectedItem);
    }

    function makeList() {
        // const logPath = pathMkr(logRoot, makeList);
        // logv(logPath, {[`${entityName}s=`]: entityEntries});
        const entries = Object.entries(entityEntries);
        // logv(null, {entries});
        const list = entries.map(e => e[1].item);
        if (doLog) logv(null, {list, initialId}, '👀👀👀');
        updateListTall(list, +(lastSavedItemId || initialId));
    }

    useConditionalEffect(isAllLoaded, makeList, [entityEntries, isAllLoaded, lastSavedItemId]);

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
            {/*<br/>*/}
            <ShowRequestState requestState={requestListState} description={TXT.rsDesc}/>
            {list ? (
                <div>
                    <SummaryTable entityType={entityType}
                                  list={list}
                                  selectedIds={selectedIds}
                                  chooseItem={chooseItemTall}
                                  small={false}
                                  UICues={UICues}
                                  elKey={elKey}
                                  key={elKey}
                                  sorting={sorting}
                                  lastSavedItemId={lastSavedItemId}
                    />
                </div>
            ) : (
                <Patience>, {TXT.building}</Patience>
            )}
        </div>
    );
}


