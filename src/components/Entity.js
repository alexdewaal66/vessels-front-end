import React from 'react';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { CommandContextProvider } from '../contexts/CommandContext';
import { EditEntity } from './EditEntity';
import { SummaryList } from './summaryList';
import pageLayout from '../pageLayouts/pageLayout.module.css';


export function Entity({entity, initialId}) {
    const metadata = entity ?? entitiesMetadata.xyz;
    const elKey =` Entity(${metadata.name},${initialId})`;

    return (
        <CommandContextProvider>
            <div className={pageLayout.splitView}>
                <span className={pageLayout.firstPart}>
                    <SummaryList metadata={metadata}
                                 initialId={initialId}
                                 receiver={'EditEntity'}
                                 key={elKey}
                                 elKey={elKey}
                                 UICues={{hasFocus:true}}
                    />
                </span>
                <span className={pageLayout.secondPart}>
                    <EditEntity metadata={metadata} />
                </span>
            </div>
        </CommandContextProvider>
    );
}

