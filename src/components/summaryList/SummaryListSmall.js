import React, { useContext, useEffect } from 'react';
import { createEmptyItem } from '../../helpers/globals/entityTypes';
import { keys, useKeyPressed, useRequestState } from '../../helpers/customHooks';
import { usePollBackEndForChanges } from '../../helpers/usePollBackEndForChanges';
import { entityTypes } from '../../helpers/globals/entityTypes';
import { SummaryTable, useSorting } from './';
import { ShowRequestState } from '../ShowRequestState';
import { StorageContext } from '../../contexts';
import { logCondition, logv, pathMkr, rootMkr } from '../../dev/log';
import { Patience } from '../Patience';
import { useLoggingState } from '../../dev/useLoggingState';
import { languageSelector } from '../../helpers';
import { useToggleState } from '../../helpers/useToggleState';
import { sessionConfig } from '../../helpers/globals/sessionConfig';
import { SummaryLine } from './SummaryLine';

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

function collapseInverter(x) {
    return sessionConfig.collapseInputObject.value ? !x : x;
}

function blns(x) {
    let output = '';
    for (const key in x) {
        output += key + (x[key] ? ':𝐓 ; ' : ':𝐅 ; ');
    }
    return output.slice(0, -3);
}

const hiddenFieldStyle = () =>
    sessionConfig.showHiddenFields.value
        ? {opacity: '50%', cursor: 'default'}
        : {opacity: '0', position: 'absolute', width: 0,};


export function SummaryListSmall({
                                     entityType, initialIdList, UICues,
                                     setHiddenField, elKey,
                                     // toggleCollapsed,
                                     fieldName,
                                     parentName, selectedIds,
                                 }) {
    elKey += '/SListSmall';
    if (!entityType) logv(rootMkr(SummaryListSmall), {elKey}, '❌');
    const entityName = entityType.name;
    const logRoot = rootMkr(SummaryListSmall, entityName, '↓↓');
    const storage = useContext(StorageContext);
    const {isAllLoaded, store} = storage;
    const {isMulti, hasNull, readOnly, borderStyle} = UICues;
    const doLog = logCondition(SummaryListSmall, entityName);
    const entityEntries = storage.getEntries(entityName)
    if (doLog) logv(logRoot, {entityEntries, initialIdList});

    // const counter = useCounter(logRoot, entityName, 1000);//todo remove

    // const typeField = entityType.fields[fieldName];
    const [isCollapsed, toggleCollapsed] = useToggleState(collapseInverter(false));

    const TXT = messages[languageSelector()];

    if (!initialIdList)
        initialIdList = [0];

    const requestListState = useRequestState();
    const [list, setList] = useLoggingState(null, 'list', logRoot, entityName);

    const {isControlDown, handleOnControlUp, handleOnControlDown} = useKeyPressed(keys.control);

    const sorting = useSorting(
        (x) => chooseItemSmall(updateListSmall(x)),
        list, entityType);

    if (doLog) logv(logRoot, {
        initialIdList, isAllLoaded,
        selectedIds_all: selectedIds.all, list
    }, initialIdList.length !== selectedIds.size ? '❌' : '✔');
    usePollBackEndForChanges(storage, entityName);


    async function chooseItemSmall(item) {
        const logPath = pathMkr(logRoot, chooseItemSmall);// + counter.log;
        if (doLog) logv(logPath, {item, isKeyDown: isControlDown});
        let newSelectedIds;
        if (item?.id === optionalIdValue) {
            const blankItem = createEmptyItem(entityTypes, entityType);
            blankItem.id = optionalIdValue;
            await storage.newItem(entityType.name, blankItem,
                (savedItem) => {
                    item = savedItem;
                    // logv(logPath, {item});
                });
        }
        if (isMulti && isControlDown) {
            logv(logPath, {item, selectedIds})
            newSelectedIds = selectedIds.toggle(item.id);
        } else {
            newSelectedIds = selectedIds.new([item?.id || 0]);
        }
        setHiddenField([...newSelectedIds].join(','));
        // logv(logPath, {newSelectedIds});
    }

    function updateListSmall(newList) {
        const logPath = pathMkr(logRoot, updateListSmall);// + counter.log;
        // logv(logPath, {newList, renderCount: counter.value});
        let selectedItem;
        if (newList.length === 0) {
            logv(logPath, {newList}, '❗❗❗ newList.length === 0');
            selectedIds.new();
            selectedItem = null;
        } else {
            sorting.sort(newList);
            const firstId = initialIdList?.[0]
            const shouldASingleIdBeSelected = !!firstId;
            const shouldMore = initialIdList.length > 1;
            if (doLog) logv(null, {initialIdList, shouldASingleIdBeSelected});
            if (shouldASingleIdBeSelected) {
                selectedItem = storage.getItem(entityName, firstId);
                // logv( '❗❗❗' + logPath + ' » if (shouldASingleIdBeSelected)',
                //     {firstId, selectedItem});
                selectedIds.add(firstId);
            } else if (shouldMore) {
                selectedIds.new(initialIdList);
                selectedItem = initialIdList.map(id => storage.getItem(entityName, id));
            } else {
                selectedItem = null;
                selectedIds.new();
            }
        }
        setList(newList);
        // logv(logPath, {selectedIds, selectedItem});
        // chooseItemSmall(selectedItem);
        return selectedItem;
    }


    function makeList() {
        const logPath = pathMkr(logRoot, makeList);// + counter.log;
        if (doLog) logv(logPath, {[`store.${entityName}=`]: store[entityName]});
        const entries = Object.entries(entityEntries);
        if (doLog) logv(logPath, {entries});
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
        if (doLog) logv(logPath, {list});
        updateListSmall(list);
        setHiddenField(initialIdList.join(','));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(makeList, [entityEntries, isAllLoaded]);

    // if (counter.passed) return <Sorry context={SummaryListSmall.name} count={counter.value}/>;

    return (
        <>
            <span style={hiddenFieldStyle()}>
                {blns({isCollapsed})} ; length: {initialIdList.length}
            </span>
            {(isCollapsed && initialIdList.length < 2)
                ? <SummaryLine entityType={entityType}
                               initialIdList={initialIdList}
                               receiver={'Input'}
                               key={elKey + fieldName + '_line'}
                               elKey={elKey + fieldName + '_line'}
                               UICues={{hasFocus: false, hasNull, isMulti, borderStyle, readOnly}}
                               setHiddenField={setHiddenField}
                               toggleCollapsed={toggleCollapsed}
                               parentName={parentName}
                />
                : <div onKeyDown={handleOnControlDown} onKeyUp={handleOnControlUp} style={{minHeight: '12em'}}>
                    <ShowRequestState requestState={requestListState} description={TXT.rsDesc}/>
                    {list && (
                        <div>
                            {/*{isMulti && (*/}
                            {/*    <Stringify data={[...selectedIds.all]}>selectedIds</Stringify>*/}
                            {/*)}*/}
                            <SummaryTable entityType={entityType}
                                          list={list}
                                          selectedIds={selectedIds}
                                          chooseItem={chooseItemSmall}
                                          small={true}
                                          UICues={UICues}
                                          elKey={elKey}
                                          key={elKey}
                                          sorting={sorting}
                                          toggleCollapsed={toggleCollapsed}
                                          parentName={parentName}
                            />
                        </div>
                    )}
                    {!list && <Patience>, {TXT.building}</Patience>}
                </div>
            }

        </>
    );
}
