import React, {useState} from 'react';
import { entityTypes } from '../helpers';
import { CommandContextProvider } from '../contexts/CommandContext';
import { EditEntity } from './EditEntity';
import { SummaryListTall } from './summaryList';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { useCounter } from '../dev/useCounter';
import { rootMkr } from '../dev/log';
import { Sorry } from '../dev/Sorry';
import { useLoggingState } from '../dev/useLoggingState';
// import { logv } from '../dev/log';

// const messages = {NL: {}, EN: {}};


export function Entity({entityType = entityTypes.vessel, initialId}) {
    const logRoot = rootMkr(Entity, entityType.name);
    const elKey =` Entity(${entityType.name},${initialId?.toString()})`;
    const [item, setItem] = useLoggingState(null, 'item', logRoot, entityType.name);
    // logv(logRoot, {initialId, item});

    // const [submitTime, setSubmitTime] = useState('');

    // const TXT = messages[language()];

    const counter = useCounter(logRoot, entityType.name, 100);
    if (counter.passed) return <Sorry context={Entity.name} count={counter.value}/>;

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
                                // submitTime={submitTime}
                                // setSubmitTime={setSubmitTime}
                    />
                </span>
            </div>
        </CommandContextProvider>
    );
}

