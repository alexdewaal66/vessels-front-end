import React, {useState} from 'react';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { CommandContextProvider } from '../contexts/CommandContext';
import { EditEntity } from './EditEntity';
import { SummaryList } from './summaryList';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { now } from '../helpers/utils';


export function Entity({metadata = entitiesMetadata.xyz, initialId}) {
    // const metadata = entity ?? entitiesMetadata.xyz;
    console.log(now() + `metadata.name=`, metadata.name);
    const elKey =` Entity(${metadata.name},${initialId})`;
    const [item, setItem] = useState(null);


    return (
        <CommandContextProvider>
            <div className={pageLayout.splitView}>
                <span className={pageLayout.firstPart}>
                    {/*<div>{metadata.name}</div>*/}
                    <SummaryList metadata={metadata}
                                 initialId={initialId}
                                 receiver={'EditEntity'}
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

