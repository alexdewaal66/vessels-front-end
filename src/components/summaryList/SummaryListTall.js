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
// import { Stringify } from '../../dev/Stringify';
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

    const {isKeyDown, handleOnKeyUp, handleOnKeyDown} = useKeyPressed(keys.control);

    const {useCommand, setCommand} = useContext(CommandContext);
    // const {useObserver, raise, hasHandler} = useContext(ObserverContext);
    // const [filtering, setFiltering] = useState({})

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
        newSelectedIds = new Set([item?.id]);
        selectedIds.new(newSelectedIds);
        console.log('>>> setCommand from chooseItemTall()');
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
            selectedIds.new([selectedItem.id]);
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
                    ? newList.find(item => item.id === initialIdList[0])
                    : newList[0];
                // logv(logPath, {selectedItem});
                if (selectedItem)
                    selectedIds.add(selectedItem.id);
            }
        }
        setList(newList);
        // logv(logPath, {selectedIds, selectedItem});
        // if (selectedItem)
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
        // sorteren
        // if  |iIL| > |list|  -->  error
        // if tall  -->
        //          initialIdList.length should be 0 or 1
        //          if |iIL| > 1  -->  error
        //          if |list| = 0  -->
        //                  create empty
        //          if |list| = 1  OR |iIL| = 0  -->
        //                  focus naar list[0] :
        //                        setSelectedIds(new Set([list[0].id]))
        //          else  -->
        //                  setSelectedIds(new Set([initialIdList[0]]))
        //          chooseItem() ??
        //
    }

    // const isEditEntityReady = hasHandler({operation: operationNames.edit, entityName});

    useConditionalEffect(
        fetchList,
        allIdsLoaded
        // && isEditEntityReady
        ,
        [
            store[entityName].state, allIdsLoaded
            // , isEditEntityReady
        ]
    );

    const conditions = {
        entityType: metadata,
        receiver: SummaryListTall.name,
        operations: {
            put: (formData) => {
                const id = formData.id;
                const index = list.findIndex(item => item.id === id);
                const newList = [...list.slice(0, index), formData, ...list.slice(index + 1)];
                // logv(logRoot + ' » conditions.put()', {id, index, newList});
                updateListTall(newList, id);
                // hersorteren nodig
                // focus behouden:
                //          setSelectedIds(new Set([id]) )
            },
            post: (formData) => {
                // const newList = [...list, formData];
                // logv(logRoot + ' » conditions.post()', {formData, newList});
                // updateList(newList, formData.id);
                // logv(logRoot + ' » conditions.post()', {formData, list});
                updateListTall(list, formData.id);
                // hersorteren nodig
                // toevoegen aan selectedIds
                // krijgt focus
                //          setSelectedIds(new Set([formData.id]) )
            },
            delete: (formData) => {
                const index = list.findIndex(item => item.id === formData.id);
                const newList = [...list.slice(0, index), ...list.slice(index + 1)];
                updateListTall(newList, null);
                // hersorteren niet nodig
                // verwijderen uit selectedIds
                // focus naar list[0]
                //          setSelectedIds(new Set([list[0]]) )
            },
        }
    }

    useCommand(conditions);


    return (
        <div onKeyDown={handleOnKeyDown} onKeyUp={handleOnKeyUp}>
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {/*<Stringify data={store[entityName].state}>{entityName}</Stringify>*/}
            {list && (
                <div>
                    {/*<div>SL: selectedIds={selectedIds} ; initialIdList={initialIdList}</div>*/}
                    <SummaryTable metadata={metadata}
                                  list={list}
                                  selectedIds={selectedIds}
                                  chooseItem={chooseItemTall}
                                  small={false}
                                  hasFocus={hasFocus}
                                  elKey={elKey}
                                  key={elKey}
                                  setSorting={setSorting}
                        // setFiltering={setFiltering}
                        // elKey={elKey+selectedIds}
                        // key={elKey+selectedIds}
                    />
                </div>
            )}
        </div>
    );
}

