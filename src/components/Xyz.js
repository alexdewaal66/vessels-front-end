import React from 'react';
import { entities } from '../helpers/entities';
import { CommandContextProvider } from '../contexts/CommandContext';
import { EditEntity } from './EditEntity';
import { SummaryList } from './summaryList';
import pageLayout from '../pageLayouts/pageLayout.module.css';


export function Xyz({entity, initialId}) {
    const metadata = entity ?? entities.xyz;

    return (
        <CommandContextProvider>
            <div className={pageLayout.splitView}>
                <span className={pageLayout.firstPart}>
                    {/*<h4>{metadata.label}</h4>*/}
                    <SummaryList metadata={metadata}
                                 initialId={initialId}
                                 small={false}
                                 receiver={'EditEntity'}
                    />
                </span>
                <span className={pageLayout.secondPart}>
                    <EditEntity metadata={metadata} />
                </span>
            </div>
        </CommandContextProvider>
    );
}

