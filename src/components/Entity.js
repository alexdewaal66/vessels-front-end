import React, {useState} from 'react';
import { entityTypes } from '../helpers';
import { CommandContextProvider } from '../contexts/CommandContext';
import { EditEntity } from './EditEntity';
import { SummaryListTall } from './summaryList';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { logv } from '../dev/log';


export function Entity({entityType = entityTypes.vessel, initialId}) {
    const logRoot = `${Entity.name}(${entityType.name})`;
    const elKey =` Entity(${entityType.name},${initialId?.toString()})`;
    const [item, setItem] = useState(null);
    // logv(logRoot, {initialId, item});

    const [submitTime, setSubmitTime] = useState('');


    return (
        <CommandContextProvider>
            <div className={pageLayout.splitView}>
                <span className={pageLayout.firstPart}>
                    {/*<div>{entityType.name}</div>*/}
                    <SummaryListTall entityType={entityType}
                                     initialId={initialId}
                                     receiver={EditEntity.name}
                                     key={elKey}
                                     elKey={elKey}
                                     UICues={{hasFocus:true}}
                    />
                </span>
                <span className={pageLayout.secondPart}>
                    <EditEntity entityType={entityType}
                                item={item} setItem={setItem}
                                receiver={SummaryListTall.name}
                                key={elKey + ` / EditEntity(${item?.id})`}
                                elKey={elKey + ` / EditEntity(${item?.id})`}
                                submitTime={submitTime}
                                setSubmitTime={setSubmitTime}
                    />
                </span>
            </div>
        </CommandContextProvider>
    );
}

