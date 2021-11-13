import React, { useContext, useState } from 'react';
import { useConditionalEffect, useRequestState, useBGLoading, createEmptyItem } from '../../helpers';
import { SummaryTable } from './';
import { CommandContext, operationNames, useCommand } from '../../contexts/CommandContext';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts/StorageContext';
// import { Stringify } from '../../dev/Stringify';
import { TTC } from '../../dev/Tooltips';
import { errv, logv } from '../../dev/log';

const keys = {shift: 16, control: 17, alt: 18};

export function SummaryList({
                                metadata, initialIdList, receiver, UICues,
                                useFormFunctions, inputHelpFields, elKey
                            }) {
    //TODO❗❗ GEEN RIJ SELECTEREN BINNEN EEN INPUT ALS VERWIJZING NULL IS, IS NU RIJ 1
    elKey += '/SList';
    const entityName = metadata.name;
    let logRoot = `${SummaryList.name}(${entityName})`;
    const storage = useContext(StorageContext);
    const {allIdsLoaded, store, getItem} = storage;
    // logv(logRoot, {tree: store[entityName].state});
    const {small, hasFocus, isMulti} = UICues;
    // logv(logRoot + ` ▶▶▶ props:`,
    //     {metadata, initialIdList, receiver, UICues, useFormFunctions, inputHelpFields, elKey});
    const requestListState = useRequestState();
    const [list, setList] = useState(null);

    const [selectedIds, setSelectedIds] = useState(new Set());

    const [command, setCommand] = useContext(CommandContext);
    const [isCtrlDown, setIsCtrlDown] = useState(false);
    const [sorting, setSorting] = useState({propertyName: 'id', order: 'up'});
    // const [filtering, setFiltering] = useState({})

    // logv(logRoot + ` states:`, {
    //     initialIdList, allIdsLoaded,
    //     'store[entityName].state': store[entityName].state,
    //     selectedIds, list
    // });
    useBGLoading(storage, metadata);

    function clickItem(item) {
        const logPath = `${logRoot} » ${clickItem.name}()`;
        let conditionsLog;
        let newSelectedIds;
        logv(logPath, {'item?.id': item?.id, isCtrlDown});
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
        // logv(logPath, {conditionsLog});
        if (inputHelpFields) {
            manipulateInputHelpFields(item, newSelectedIds);
        } else {
            console.log('>>> setCommand from clickItem()');
            setCommand({operation: operationNames.edit, data: item, entityType: metadata, receiver: receiver});
        }
    }

    function manipulateInputHelpFields(item, newSelectedIds) {
        const {getValues: getFormValues, setValue: setFormValue} = useFormFunctions;
        const logPath = logRoot + manipulateInputHelpFields.name + '() ';
        const [hiddenFieldName, nullFieldRef] = inputHelpFields;
        nullFieldRef.current.value = (newSelectedIds.size === 0);
        nullFieldRef.current.checked = (newSelectedIds.size === 0);
        logv(logPath, {
            item, newSelectedIds, hiddenFieldName,
            hiddenField: getFormValues(hiddenFieldName)
        });
        // if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
        setFormValue(hiddenFieldName, [...newSelectedIds].toString());
        // } else {
        //     const idList = getFormValues(hiddenFieldName).split(',');
        //     if (!idList.includes(item.id.toString())) {
        //         idList.push(item.id.toString());
        //         setFormValue(hiddenFieldName, idList.join());
        //     }
        // }
        logv(null, {
            item, newSelectedIds, hiddenFieldName,
            hiddenField: getFormValues(hiddenFieldName),
            formValues: getFormValues()
        });
    }

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
        const logPath = logRoot + ` » ${updateList.name}()`;
        logv(logPath, {newList, singleSelectedId});
        let selectedItem;
        if (newList.length === 0) {
            if (small) {
                setSelectedIds(new Set());
                selectedItem = null;
            } else {// maak 'leeg' object om te kunnen editen en bewaren als nieuw
                console.log(`createEmptyItem(${entityName})`);
                selectedItem = createEmptyItem(metadata);
                // logv(logPath + '|newList|=0, small', {selectedItem});
                newList.push(selectedItem);
                // logv(logPath,  {newList});
                setSelectedIds(new Set([selectedItem.id]));
            }
        } else { // newList.Length > 0
            // newList.sort((a, b) => a.id - b.id);
            // logv(logPath, {sorting, newList});
            sortList[sorting.order](newList);
            // logv(logPath, {newList});
            if (small) {
                const firstId = initialIdList?.[0]
                const shouldAnIdBeSelected = !!firstId;
                logv(null, {initialIdList, shouldAnIdBeSelected});
                if (shouldAnIdBeSelected) {
                    selectedItem = store[entityName].state[firstId].item;
                    const selectedItem2 = getItem(entityName, firstId);
                    logv(logPath + ' » if (small) » if (shouldAnIdBeSelected)', {
                        firstId, selectedItem, selectedItem2
                    })
                    setSelectedIds(ids => new Set([...ids, firstId]));
                } else {
                    selectedItem = null;
                    setSelectedIds(new Set());
                }
            } else {
                if (singleSelectedId) {
                    if (singleSelectedId < 0) logv('❌❌❌❌ '+ logPath);
                    // selectedItem = newList.find(item => item.id === singleSelectedId);
                    selectedItem =  getItem(entityName, singleSelectedId);
                    logv(logPath + ' if (singleSelectedId)', {selectedItem});
                    setSelectedIds(new Set([singleSelectedId]));
                } else {
                    const shouldAnIdBeSelected = !!(initialIdList?.[0]);
                    // logv(null, {initialIdList, shouldAnIdBeSelected});
                    selectedItem = shouldAnIdBeSelected
                        ? newList.find(item => item.id === initialIdList[0])
                        : newList[0];
                    // logv(logPath, {selectedItem});
                    setSelectedIds(ids => new Set([...ids, selectedItem?.id]))
                }
            }
        }
        setList(newList);
        // logv(logPath, {selectedIds, selectedItem});
        // if (selectedItem)
        clickItem(selectedItem);
    }

    function fetchList() {
        const logPath = logRoot + fetchList.name + '()';
        // logv(logPath, {[`store.${entityName}.state=`]: store[entityName].state});
        const entries = Object.entries(store[entityName].state);
        // logv(logPath, {entries});
        const list = entries.map(e => e[1].item);
        // logv(logPath, {list});
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
        //          clickItem() ??
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
        //          clickItem() ??
    }

    useConditionalEffect(fetchList, allIdsLoaded, [store[entityName].state, allIdsLoaded]);

    const conditions = {
        entityType: metadata,
        receiver: SummaryList.name,
        operations: {
            put: (formData) => {
                const id = formData.id;
                const index = list.findIndex(item => item.id === id);
                const newList = [...list.slice(0, index), formData, ...list.slice(index + 1)];
                logv(logRoot + ' » conditions.put()', {id, index, newList});
                updateList(newList, id);
                // hersorteren nodig
                // focus behouden:
                //          setSelectedIds(new Set([formData.id]) )
            },
            post: (formData) => {
                const newList = [...list, formData];
                logv(logRoot + ' » conditions.post()', {formData, newList});
                updateList(newList, formData.id);
                // hersorteren nodig
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
        if (e.keyCode === keys.control)
            setIsCtrlDown(true);
    }

    function handleOnKeyUp(e) {
        if (e.keyCode === keys.control)
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
                                  clickItem={clickItem}
                                  small={small}
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
        </TTC>
    );
}
