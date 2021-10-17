import React from 'react';
import { SummaryList } from '../components/summaryListMS';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { now } from '../helpers/utils';
import { CommandContextProvider } from '../contexts/CommandContext';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { EditEntity } from '../components';

export function TestMultiSelect({metadata = entitiesMetadata.zyx, initialIdList = []}) {
    console.log(`${now()} \n EntityMS(entity=${metadata.name},  initialIdList=${initialIdList})`);
    const elKey =` Entity(${metadata.name},${initialIdList.toString()})`;

    return (
        <>TestMultiSelect
            <CommandContextProvider>
                    {/*<div>{metadata.name}</div>*/}
                    <SummaryList metadata={metadata}
                                 initialIdList={initialIdList}
                                 receiver={'TestMultiSelect'}
                                 UICues={{small: true, hasFocus: false}}
                                 key={elKey}
                                 elKey={elKey}
                    />
            </CommandContextProvider>
        </>
    );
}
