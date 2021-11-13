import React, {useState} from 'react';
import { entitiesMetadata } from '../helpers';
import { CommandContextProvider } from '../contexts/CommandContext';
import { EditEntity } from './EditEntity';
import { SummaryList } from './summaryList';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { logv } from '../dev/log';


export function Entity({metadata = entitiesMetadata.vessel, initialIdList}) {
    const logRoot = Entity.name + `(${metadata.name}) `;
    // logv(logRoot, {initialIdList});
    const elKey =` Entity(${metadata.name},${initialIdList?.toString()})`;
    const [item, setItem] = useState(null);


    return (
        <CommandContextProvider>
            <div className={pageLayout.splitView}>
                <span className={pageLayout.firstPart}>
                    {/*<div>{metadata.name}</div>*/}
                    <SummaryList metadata={metadata}
                                 initialIdList={initialIdList}
                                 receiver={EditEntity.name}
                                 key={elKey}
                                 elKey={elKey}
                                 UICues={{hasFocus:true}}
                    />
                </span>
                <span className={pageLayout.secondPart}>
                    <EditEntity metadata={metadata}
                                item={item} setItem={setItem}
                                key={elKey + ` / EditEntity(${item?.id})`}
                                elKey={elKey + ` / EditEntity(${item?.id})`}
                    />
                </span>
            </div>
        </CommandContextProvider>
    );
}

