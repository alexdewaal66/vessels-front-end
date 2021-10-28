import React, { useContext, useEffect, useState } from 'react';
import { useConditionalEffect, useRequestState, useBGLoading, createEmptyItem, now } from '../../helpers';
import { SummaryTable, summaryStyle } from './';
import { CommandContext, operationNames, useCommand } from '../../contexts/CommandContext';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
import { Stringify } from '../../dev/Stringify';
import { TTC, TT } from '../../dev/Tooltips';
import { lgv } from '../../dev/log';

const keys = {shift: 16, control: 17, alt: 18};

export function SummaryList({
                                metadata, initialIdList, receiver, UICues,
                                useFormFunctions, inputHelpFields, elKey
                            }) {
    //TODO❗❗ GEEN RIJ SELECTEREN BINNEN EEN INPUT ALS VERWIJZING NULL IS, IS NU RIJ 1
    elKey += '/SList';
    const entityName = metadata.name;
    let logRoot = `SummaryList(${entityName})`;
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store} = storage;
    const {small, hasFocus, isMulti} = UICues;
    console.log(now() + ` SummaryList() ▶▶▶ props=`,
        {metadata, initialIdList, receiver, UICues, useFormFunctions, inputHelpFields, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);
    // const [preSelectedIdList, setPreSelectedIdList] = useState(initialIdList);

    // const [selectedIds, setSelectedIds] = useState(new Set(initialIdList));
    const [selectedIds, setSelectedIds] = useState(new Set());

    const [centeredId, setCenteredId] = useState();
    const [command, setCommand] = useContext(CommandContext);
    const [isCtrlDown, setIsCtrlDown] = useState(false);
    const [sorting, setSorting] = useState({propertyName: 'id', order: 'up'});
    const [filtering, setFiltering] = useState({})

    console.log(now(), `\n SummaryListMS(${entityName}) » body `,
        `\n\t initialIdList=`, initialIdList,
        // `\n\t preSelectedIdList=`, preSelectedIdList,
        `\n\t selectedIds=`, selectedIds,
        `\n\t list=`, list);
    useBGLoading(storage, metadata);

    function editItem(item) {
        const logPath = logRoot + ` » editItem()`;
        let conditionsLog;
        let newSelectedIds;
        lgv(logPath, {'item?.id': item?.id, isCtrlDown});
        if (small && isMulti && isCtrlDown) {
            if (selectedIds.has(item.id)) {
                setSelectedIds(ids => {
                    newSelectedIds = new Set(ids);
                    newSelectedIds.delete(item.id);
                    return newSelectedIds;
                });
                conditionsLog = 'T-T';
            } else {
                setSelectedIds(ids => {
                    newSelectedIds = new Set(ids);
                    newSelectedIds.add(item.id)
                    return newSelectedIds;
                })
                conditionsLog = 'T-F';
            }
        } else {
            newSelectedIds = new Set([item?.id]);
            setSelectedIds(newSelectedIds);
            conditionsLog = 'F-*';
        }
        console.log(now() + `\n SummaryListMS(${entityName}) » editItem()`,
            `\n\t conditionsLog=`, conditionsLog);
        if (inputHelpFields) {
            manipulateInputHelpFields(item, newSelectedIds);
        } else {
            // console.log('>>> setCommand from editItem()');
            setCommand({operation: operationNames.edit, data: item, entityType: metadata, receiver: receiver});
        }
    }

    function manipulateInputHelpFields(item, newSelectedIds) {
        const [hiddenFieldName, nullFieldRef] = inputHelpFields;
        // useFormFunctions.setValue(nullFieldName, +(selectedIds.size > 0));
        nullFieldRef.current.value = (newSelectedIds.size === 0);
        nullFieldRef.current.checked = (newSelectedIds.size === 0);
        // console.log(now(),
        //     `\n SummaryListMS(${entityName}) » editItem() >>> setValue`,
        //     `\n❗❗❗ checkbox written with (newSelectedIds.size === 0):`, (newSelectedIds.size === 0),
        //     `\n❗❗❗ newSelectedIds.size =`, newSelectedIds.size);
        if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
            // console.log(now(),
            //     `\n SummaryListMS(${entityName}) » editItem() >>> setValue`,
            //     `\n hiddenFieldName=`, hiddenFieldName,);
            useFormFunctions.setValue(hiddenFieldName, [...selectedIds].toString());
            // console.log(now(),
            //     `\n SummaryListMS(${entityName}) » editItem() >>> setValue`,
            //     `\n form value hiddenFieldName=`, useFormFunctions.getValues(hiddenFieldName));
        } else {
            const idList = useFormFunctions.getValues(hiddenFieldName).split(',');
            if (!idList.includes(item.id.toString())) {
                idList.push(item.id.toString());
                useFormFunctions.setValue(hiddenFieldName, idList.join());
            }
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // useEffect(function whyIsThisNotSuperfluous() {
    //     if (preSelectedIdList !== initialIdList) {
    //         setSelectedIds(initialIdList);
    //         setPreSelectedIdList(initialIdList);
    //     }
    // })

    useConditionalEffect(() => updateList([...list])
        , (!!sorting && !!list), [sorting]);

    function compare(p, q) {
        if (typeof p === 'string' && typeof q === 'string') {
            p = p.toLowerCase();
            q = q.toLowerCase();
        }
        if (p < q) return -1;
        if (p > q) return 1;
        return 0;
    }

    const sortList = {
        up: function (list) {
            list.sort((a, b) => compare(a[sorting.propertyName], b[sorting.propertyName]))
        },
        down: function (list) {
            list.sort((a, b) => compare(b[sorting.propertyName], a[sorting.propertyName]))
        },
    };

    function updateList(newList, singleSelectedId) {
        const logPath = logRoot + ` » updateList()`;
        lgv(logPath, {newList});
        let selectedItem;
        if (newList.length === 0) {
            if (small) {
                setSelectedIds(new Set());
                selectedItem = null;
            } else {// maak 'leeg' object om te kunnen editen en bewaren als nieuw
                // console.log(`createEmptyItem(${entityName})`);
                selectedItem = createEmptyItem(metadata);
                // lgv(logPath + '|newList|=0, small', {selectedItem});
                newList.push(selectedItem);
                // lgv(logPath,  {newList});
                setSelectedIds(new Set([selectedItem.id]));
            }
        } else { // newList.Length > 0
            // newList.sort((a, b) => a.id - b.id);
            lgv(logPath, {sorting, newList});
            sortList[sorting.order](newList);
            lgv(logPath, {newList});
            if (small) {
            } else {
                if (singleSelectedId) {
                    selectedItem = newList.find(item => item.id === singleSelectedId);
                    setSelectedIds(new Set([singleSelectedId]));
                } else {
                    setSelectedIds(new Set(initialIdList));// superfluous??
                    selectedItem = initialIdList
                        ? newList.find(item => item.id === initialIdList[0])
                        : newList[0];
                }
            }
        }
        setList(newList);
        console.log(now() + `\n SummaryListMS(${entityName}) »  updateList()`,
            `\n\t selectedIds=`, selectedIds,
            `\n\t selectedItem=`, selectedItem);
        // if (selectedItem)
        editItem(selectedItem);
    }

    function fetchList() {
        console.log(now() + ' fetchList()');
        // console.log(`SummaryList » fetchList() \n\t store[${entityName}].state=`, store[entityName].state);
        const entries = Object.entries(store[entityName].state);
        // console.log(`SummaryList » fetchList() \n\t entries=`, entries);
        const list = entries.map(e => e[1].item);
        // console.log(`SummaryList » fetchList() \n\t list=`, list);
        updateList(list, null);
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
        //          editItem() ??
        //
        // if small  -->
        //          if |iIL| = 0  OR  |list| = 0  -->
        //                  check nullField somehow
        //                  setSelectedIds( new Set() )
        //          else  -->
        //                  uncheck nullField
        //                  if !isMulti
        //                          if |iIL| > 1  -->  error
        //                          setSelectedIds(new Set([initialIdList[0]]))
        //                  if isMulti
        //                          setSelectedIds(new Set(initialIdList))
        //          editItem() ??
    }

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
                // hersorteren niet nodig als alleen op id's
                // focus behouden:
                //          setSelectedIds(new Set([formData.id]) )
            },
            post: (formData) => {
                const newList = [...list, formData];
                updateList(newList, formData.id);
                // hersorteren niet nodig als alleen op id's
                // toevoegen aan selectedIds
                // krijgt focus
                //          setSelectedIds(new Set([formData.id]) )
            },
            delete: (formData) => {
                const index = list.findIndex(item => item.id === formData.id);
                const newList = [...list.slice(0, index), ...list.slice(index + 1)];
                updateList(newList, null);
                // hersorteren niet nodig
                // verwijderen uit selectedIds
                // focus naar list[0]
                //          setSelectedIds(new Set([list[0]]) )
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
        <TTC onKeyDown={handleOnKeyDown} onKeyUp={handleOnKeyUp}>
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
                                  setSorting={setSorting}
                                  setFiltering={setFiltering}
                        // elKey={elKey+selectedIds}
                        // key={elKey+selectedIds}
                    />
                </div>
            )}
        </TTC>
    );
}
