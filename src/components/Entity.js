import React, {useState} from 'react';
import { entitiesMetadata, now } from '../helpers';
import { CommandContextProvider } from '../contexts/CommandContext';
import { EditEntity } from './EditEntity';
import { SummaryList } from './summaryListMS';
import pageLayout from '../pageLayouts/pageLayout.module.css';


export function Entity({metadata = entitiesMetadata.xyz, initialIdList}, self) {
    console.log(`${now()} \n Entity(${metadata.name},  ${initialIdList?.toString()}, self=${self.label})`);
    const elKey =` Entity(${metadata.name},${initialIdList?.toString()})`;
    const [item, setItem] = useState(null);


    return (
        <CommandContextProvider>
            <div className={pageLayout.splitView}>
                <span className={pageLayout.firstPart}>
                    {/*<div>{metadata.name}</div>*/}
                    <SummaryList metadata={metadata}
                                 initialIdList={initialIdList}
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

