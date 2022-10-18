import React, { useContext, useState } from 'react';
import {
    createEmptyItem,
    keys, useKeyPressed,
    usePollBackEndForChanges,
    useConditionalEffect,
    useRequestState, entityTypes, languageSelector
} from '../../helpers';
import { SummaryTable, useSorting } from './';
import { CommandContext, operationNames } from '../../contexts';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts';
import { useImmutableSet } from '../../helpers';
import { logv, pathMkr, rootMkr } from '../../dev/log';
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
    const idName = entityType.id;
    const logRoot = rootMkr(SummaryListTall, entityName);
    const storage = useContext(StorageContext);
    const {isAllLoaded, store, getItem} = storage;
    // logv(logRoot, {tree: store[entityName].state});
    // logv(logRoot + ` ▶▶▶ props:`,
    //     {entityType, initialId, receiver, UICues, form, inputHelpFields, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    const selectedIds = useImmutableSet();
    const [lastSavedItemId, setLastSavedItemId] = useState(null);

    const {handleOnKeyUp, handleOnKeyDown} = useKeyPressed(keys.control);

    const {useCommand, setCommand} = useContext(CommandContext);

    const sorting = useSorting(updateListTall, list, entityType);

    const TXT = messages[languageSelector()];

    // logv(logRoot + ` states:`, {
    //     initialId, isAllLoaded,
    //     'store[entityName].state': store[entityName].state,
    //     selectedIds, list
    // });
    usePollBackEndForChanges(storage, entityName);


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
            selectedItem = createEmptyItem(entityTypes, entityType);
            // logv(logPath + '|newList|≡0', {selectedItem});
            newList.push(selectedItem);
            // logv(logPath, {newList});
            selectedIds.new([selectedItem[idName]]);
        } else {
            sorting.sort(newList);
            if (singleSelectedId) {
                // if (singleSelectedId < 0) logv(null, {singleSelectedId}, '< 0');
                if (!isAllLoaded) logv('❌❌❌❌' + logPath, {isAllLoaded, newList});
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

        // const entries = Object.entries(store[entityName].state);
        const entries = Object.entries(storage.getEntries(entityName));

        // logv(null, {entries});
        const list = entries.map(e => e[1].item);
        // logv(null, {list});
        updateListTall(list, (lastSavedItemId || initialId));
    }

    useConditionalEffect(isAllLoaded, makeList, [
        // store[entityName].state,
        storage.getEntries(entityName),
        isAllLoaded, lastSavedItemId
    ]);

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

