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


export function SummaryListSmall2({
                                      metadata, initialIdList, UICues,
                                      useFormFunctions, inputHelpFields,
                                      elKey
                                  }) {
    //TODO❗❗ GEEN RIJ SELECTEREN ALS VERWIJZING NULL IS, IS NU RIJ 1
    elKey += '/SListSmall';
    const entityName = metadata.name;
    let logRoot = `${SummaryListSmall2.name}(${entityName})`;
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

    // const {useCommand, setCommand} = useContext(CommandContext);

    // const [filtering, setFiltering] = useState({})

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
        manipulateInputHelpFields(item, newSelectedIds);
    }

    function manipulateInputHelpFields(item, newSelectedIds) {
        const logPath = logRoot + manipulateInputHelpFields.name + '() ';
        const {getValues: getFormValues, setValue: setFormValue} = useFormFunctions;
        const [hiddenFieldName, checkNullField] = inputHelpFields;
        const noneSelected = (newSelectedIds.size === 0);
        checkNullField(noneSelected);
        // logv(logPath, {
        //     noneSelected, item, newSelectedIds, hiddenFieldName,
        //     hiddenField: getFormValues(hiddenFieldName)
        // });
        setFormValue(hiddenFieldName, [...newSelectedIds].toString());
        // logv(null, {
        //     item, newSelectedIds, hiddenFieldName,
        //     hiddenField: getFormValues(hiddenFieldName),
        //     formValues: getFormValues()
        // });
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
        const nullItem = {id: 0};
        nullItem[metadata.summary[1]] = '➖➖';
        list.push(nullItem);
        // logv(logPath, {list});
        updateListSmall(list);
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


    return (
        <div onKeyDown={handleOnControlDown} onKeyUp={handleOnControlUp}>
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {/*<Stringify data={store[entityName].state}>{entityName}</Stringify>*/}
            {list && (
                <div>
                    {/*<div>SL: selectedIds={selectedIds} ; initialIdList={initialIdList}</div>*/}
                    <SummaryTable metadata={metadata}
                                  list={list}
                                  selectedIds={selectedIds}
                                  chooseItem={chooseItemSmall}
                                  small={true}
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
