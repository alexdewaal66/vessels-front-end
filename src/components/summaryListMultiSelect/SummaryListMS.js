import React, { useContext, useEffect, useState } from 'react';
import { now } from '../../helpers/utils';
import { useConditionalEffect, useRequestState } from '../../helpers/customHooks';
import { SummaryTableMS } from './';
import { CommandContext, operationNames, useCommand } from '../../contexts/CommandContext';
import { createEmptyItem } from '../../helpers/entitiesMetadata';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
import { useBGLoading } from '../../helpers/useBGLoading';
import { Stringify } from '../../dev/Stringify';

const keys = {shift: 16, control: 17, alt: 18};

export function SummaryListMultiSelect({
                                           metadata, initialIdList, receiver, UICues,
                                           useFormFunctions, inputHelpFields, elKey
                                       }) {
    //TODO❗❗ GEEN RIJ SELECTEREN BINNEN EEN INPUT ALS VERWIJZING NULL IS, IS NU RIJ 1
    elKey += '/SList';
    const entityName = metadata.name;
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, loadItemsByIds} = storage;
    const {small, hasFocus} = UICues;
    // console.log(`▶▶▶ props=`, {metadata, initialIdList, receiver, UICues, useFormFunctions, hiddenFieldName, elKey});
    // const {endpoint} = metadata;
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    // const [preSelectedIdList, setPreSelectedIdList] = useState(initialIdList);
    const [selectedIds, setSelectedIds] = useState(new Set(initialIdList));
    const [command, setCommand] = useContext(CommandContext);
    const [isCtrlDown, setIsCtrlDown] = useState(false);

    console.log(`SummaryListMS(${entityName}) » body `,
        `\n\t initialIdList=`, initialIdList,
        // `\n\t preSelectedIdList=`, preSelectedIdList,
        `\n\t selectedIds=`, selectedIds,
        `\n\t list=`, list);
    useBGLoading(storage, metadata);

    function editItem(item) {
        let ifBranch = '';
        console.log(now() + `\n SummaryListMS(${entityName}) » editItem()`,
            `\n\t item.id=`, item.id,
            `\n\t isCtrlDown=`, isCtrlDown);
        /*     ┌————————————┬———————————————————┬————————————————————┐
               │ isCtrlDown │  was selected     │  action            │
               ├————————————┼———————————————————┼————————————————————┤
               │    T       │       T           │   remove from list │
               │    T       │       F           │   add to list      │
               │    F       │       *           │   set as only item │
               └————————————┴———————————————————┴————————————————————┘  */
        if (isCtrlDown) {
            if (selectedIds.has(item.id)) {
                setSelectedIds(ids => {
                    const copy = new Set(ids);
                    copy.delete(item.id);
                    return copy;
                });
                ifBranch = 'T-T';
            } else {
                setSelectedIds(ids => new Set(ids).add(item.id))
                ifBranch = 'T-F';
            }
        } else {
            setSelectedIds(new Set([item.id]));
            ifBranch = 'F-*';
        }
        console.log(now() + `\n SummaryListMS(${entityName}) » editItem()`,
            `\n\t ifBranch=`, ifBranch);
        if (inputHelpFields) {
            const [hiddenFieldName, nullFieldName] = inputHelpFields;
            useFormFunctions.setValue(nullFieldName, false);
            if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
                // console.log('>>> setValue');
                useFormFunctions.setValue(hiddenFieldName, item.id);
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
        // console.log(now() + ` SummaryListMS(${entityName}) » updateList() \n\t newList=`, newList);
        let selectedItem;
        if (newList.length === 0) {
            selectedItem = createEmptyItem(metadata);
            // console.log(now() + `SummaryListMS(${entityName}) » updateList() \n\t selectedItem=`, selectedItem);
            newList.push(selectedItem);
            // console.log(now() + ` SummaryListMS(${entityName}) » updateList() \n\t newList=`, newList);
        } else {
            newList.sort((a, b) => a.id - b.id);
            selectedItem = newList.find(item => item.id === singleSelectedId);
        }
        // console.log(now() + `SummaryList »  updateList() \n\t selectedIds=`, selectedIds);
        setList(newList);
        setSelectedIds(singleSelectedId);
        editItem(selectedItem ?? newList[0]);
    }

    function fetchList() {
        console.log(now() + ' fetchList()');
        // console.log(`SummaryListMS » fetchList() \n\t store[${entityName}].state=`, store[entityName].state);
        const entries = Object.entries(store[entityName].state);
        // console.log(`SummaryListMS » fetchList() \n\t entries=`, entries);
        // const list = entries.map(e => e[1].item);
        const list = entries.map(e => e[1].item);
        // console.log(`SummaryList » fetchList() \n\t list=`, list);
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
        <div onKeyDown={handleOnKeyDown} onKeyUp={handleOnKeyUp}>
            <ShowRequestState requestState={requestListState} description={'het ophalen van de lijst '}/>
            {/*<Stringify data={store[entityName].state}>{entityName}</Stringify>*/}
            <div>isCtrlDown={isCtrlDown.toString()}</div>
            {list && (
                <div>
                    {/*<div>SL: selectedIds={selectedIds} ; initialIdList={initialIdList}</div>*/}
                    <SummaryTableMS metadata={metadata}
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
                    <Stringify
                        // data={selectedIds}
                        data={[...selectedIds].sort((a, b) => a - b)}
                    />
                </div>
            )}
        </div>
    );
}
