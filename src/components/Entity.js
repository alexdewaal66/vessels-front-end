import React, {useState} from 'react';
import { entitiesMetadata } from '../helpers';
import { CommandContextProvider } from '../contexts/CommandContext';
import { EditEntity } from './EditEntity';
import { SummaryListTall } from './summaryList';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { logv } from '../dev/log';


export function Entity({metadata = entitiesMetadata.vessel, initialId}) {
    const logRoot = `${Entity.name}(${metadata.name})`;
    const elKey =` Entity(${metadata.name},${initialId?.toString()})`;
    const [item, setItem] = useState(null);
    logv(logRoot, {initialId, item});


    return (
        <CommandContextProvider>
            <div className={pageLayout.splitView}>
                <span className={pageLayout.firstPart}>
                    {/*<div>{metadata.name}</div>*/}
                    <SummaryListTall metadata={metadata}
                                     initialId={initialId}
                                     receiver={EditEntity.name}
                                     key={elKey}
                                     elKey={elKey}
                                     UICues={{hasFocus:true}}
                    />
                </span>
                <span className={pageLayout.secondPart}>
                    <EditEntity metadata={metadata}
                                item={item} setItem={setItem}
                                receiver={SummaryListTall.name}
                                key={elKey + ` / EditEntity(${item?.id})`}
                                elKey={elKey + ` / EditEntity(${item?.id})`}
                    />
                </span>
            </div>
        </CommandContextProvider>
    );
}

