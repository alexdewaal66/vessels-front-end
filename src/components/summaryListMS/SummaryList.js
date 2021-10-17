import React, { useContext, useEffect, useState } from 'react';
import { now } from '../../helpers/utils';
import { useConditionalEffect, useRequestState } from '../../helpers/customHooks';
import { SummaryTable, summaryStyle } from './';
import { CommandContext, operationNames, useCommand } from '../../contexts/CommandContext';
import { createEmptyItem } from '../../helpers/entitiesMetadata';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
import { useBGLoading } from '../../helpers/useBGLoading';
import { Stringify } from '../../dev/Stringify';
import { TTC, TT } from '../../dev/Tooltips';

const keys = {shift: 16, control: 17, alt: 18};

export function SummaryList({
                                  metadata, initialIdList, receiver, UICues,
                                  useFormFunctions, inputHelpFields, elKey
                              }) {
    //TODO❗❗ GEEN RIJ SELECTEREN BINNEN EEN INPUT ALS VERWIJZING NULL IS, IS NU RIJ 1
    elKey += '/SList';
    const entityName = metadata.name;
    const isMulti = metadata.multiple;
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, loadItemsByIds} = storage;
    const {small, hasFocus} = UICues;
    console.log(now() + ` SummaryList() ▶▶▶ props=`, {metadata, initialIdList, receiver, UICues, useFormFunctions, inputHelpFields, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    // const [preSelectedIdList, setPreSelectedIdList] = useState(initialIdList);
    const [selectedIds, setSelectedIds] = useState(new Set(initialIdList));
    const [command, setCommand] = useContext(CommandContext);
    const [isCtrlDown, setIsCtrlDown] = useState(false);

    console.log(now(), `\n SummaryListMS(${entityName}) » body `,
        `\n\t initialIdList=`, initialIdList,
        // `\n\t preSelectedIdList=`, preSelectedIdList,
        `\n\t selectedIds=`, selectedIds,
        `\n\t list=`, list);
    useBGLoading(storage, metadata);

    function editItem(item) {
        let conditions;
        console.log(now() + `\n SummaryListMS(${entityName}) » editItem()`,
            `\n\t item.id=`, item.id,
            `\n\t isCtrlDown=`, isCtrlDown);
        /* ┌——————————————————————————————┬———————————————————┬————————————————————————————┐
           │ small && multi && isCtrlDown │  was selected     │  action                    │
           ├——————————————————————————————┼———————————————————┼————————————————————————————┤
           │                T             │       T           │   remove from list         │
           │                T             │       F           │   add to list              │
           │                F             │       *           │   set as only item         │
           └——————————————————————————————┴———————————————————┴————————————————————————————┘  */
        if (small && isMulti && isCtrlDown) {
            if (selectedIds.has(item.id)) {
                setSelectedIds(ids => {
                    const copy = new Set(ids);
                    copy.delete(item.id);
                    return copy;
                });
                conditions = 'T-T';
            } else {
                setSelectedIds(ids => new Set(ids).add(item.id))
                conditions = 'T-F';
            }
        } else {
            setSelectedIds(new Set([item.id]));
            conditions = 'F-*';
        }
        console.log(now() + `\n SummaryListMS(${entityName}) » editItem()`,
            `\n\t ifBranch=`, conditions);
        if (inputHelpFields) {
            const [hiddenFieldName, nullFieldName, nullFieldRef] = inputHelpFields;
            useFormFunctions.setValue(nullFieldName, +(selectedIds.size > 0));
            nullFieldRef.current.checked = (selectedIds.size === 0);
            if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
                console.log(now(),
                    `\n SummaryListMS(${entityName}) » editItem() >>> setValue`,
                    `\n hiddenFieldName=`, hiddenFieldName,
                    `\n nullFieldName=`, nullFieldName);
                useFormFunctions.setValue(hiddenFieldName, [...selectedIds].toString());
                console.log(now(),
                    `\n SummaryListMS(${entityName}) » editItem() >>> setValue`,
                    `\n form value hiddenFieldName=`, useFormFunctions.getValues(hiddenFieldName),
                    `\n form value nullFieldName=`, useFormFunctions.getValues(nullFieldName));
            } else {
                const idList = useFormFunctions.getValues(hiddenFieldName).split(',');
                if (!idList.includes(item.id.toString())) {
                    idList.push(item.id.toString());
                    useFormFunctions.setValue(hiddenFieldName, idList.join());
                }
            }
        } else {
            // console.log('>>> setCommand from');
            setCommand({operation: operationNames.edit, data: item, entityType: metadata, receiver: receiver});
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // useEffect(function whyIsThisNotSuperfluous() {
    //     if (preSelectedIdList !== initialIdList) {
    //         setSelectedIds(initialIdList);
    //         setPreSelectedIdList(initialIdList);
    //     }
    // })

    function updateList(newList = list, singleSelectedId) {
        console.log(now() + `\n SummaryList_1S(${entityName}) » updateList() \n\t newList=`, newList);
        let selectedItem;
        if (newList.length === 0) {
            if (small) {
                // lege lijst && klein
            } else {
                // maak 'leeg' object om te kunnen editen en bewaren als nieuw
                console.log(`createEmptyItem(${entityName})`);
                selectedItem = createEmptyItem(metadata);
                console.log(now() + `\n SummaryListMS(${entityName}) » updateList() \n\t selectedItem=`, selectedItem);
                newList.push(selectedItem);
                // console.log(now() + `\n SummaryList_1S(${entityName}) » updateList() \n\t newList=`, newList);
            }
        } else {
            newList.sort((a, b) => a.id - b.id);
            if (small) {
                selectedItem = null;
            } else if (singleSelectedId) {
                selectedItem = newList.find(item => item.id === singleSelectedId);
            } else {
                selectedItem = newList[0];
            }
        }
        setList(newList);
        setSelectedIds(new Set(selectedItem ? [selectedItem.id] : null));
        console.log(now() + `\n SummaryListMS(${entityName}) »  updateList() \n\t selectedIds=`, selectedIds);
        if (selectedItem) editItem(selectedItem);// ?? newList[0]);
    }

    function fetchList() {
        console.log(now() + ' fetchList()');
        // console.log(`SummaryList_1S » fetchList() \n\t store[${entityName}].state=`, store[entityName].state);
        const entries = Object.entries(store[entityName].state);
        // console.log(`SummaryList_1S » fetchList() \n\t entries=`, entries);
        // const list = entries.map(e => e[1].item);
        const list = entries.map(e => e[1].item);
        // console.log(`SummaryList_1S » fetchList() \n\t list=`, list);
        updateList(list);
    }

    // console.log(`❗❗ entityName=`, entityName);
    useConditionalEffect(fetchList, allIdsLoaded, [store[entityName].state]);

    const conditions = {
        entityType: metadata,
        receiver: 'SummaryList',
        operations: {
            put: (formData) => {
                const index = list.findIndex(item => item.id === formData.id);
                console.log(now() + ` onChange.update() index=`, index);
                const newList = [...list.slice(0, index), formData, ...list.slice(index + 1)];
                updateList(newList, formData.id);
            },
            post: (formData) => {
                const newList = [...list, formData];
                updateList(newList, formData.id);
            },
            delete: (formData) => {
                const index = list.findIndex(item => item.id === formData.id);
                const newList = [...list.slice(0, index), ...list.slice(index + 1)];
                updateList(newList);
            },
        }
    }

    useCommand(conditions, command);

    function handleOnKeyDown(e) {
        if (e.keyCode = keys.control)
            setIsCtrlDown(true);
    }

    function handleOnKeyUp(e) {
        if (e.keyCode = keys.control)
            setIsCtrlDown(false);
    }

    return (
        <TTC onKeyDown={handleOnKeyDown} onKeyUp={handleOnKeyUp} >
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {/*<Stringify data={store[entityName].state}>{entityName}</Stringify>*/}
            {/*<TT>*/}
            {/*    <div>isCtrlDown={isCtrlDown.toString()}</div>*/}
            {/*    <div>size: {selectedIds.size} ; id's: {[...selectedIds].toString()}</div>*/}
            {/*</TT>*/}
            {list && (
                <div>
                    {/*<div>SL: selectedIds={selectedIds} ; initialIdList={initialIdList}</div>*/}
                    <SummaryTable metadata={metadata}
                                  list={list}
                                  selectedIds={selectedIds}
                                  selectItem={editItem}
                                  small={small}
                                  hasFocus={hasFocus}
                                  elKey={elKey}
                                  key={elKey}
                        // elKey={elKey+selectedIds}
                        // key={elKey+selectedIds}
                    />
                </div>
            )}
        </TTC>
    );
}
