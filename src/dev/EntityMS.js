import React from 'react';
import { SummaryListMultiSelect } from '../components/summaryListMultiSelect';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { now } from '../helpers/utils';
import { CommandContextProvider } from '../contexts/CommandContext';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { SummaryList } from '../components/summaryList';
import { EditEntity } from '../components';

export function EntityMS({metadata = entitiesMetadata.zyx, initialIdList = [1]}) {
    console.log(`${now()} \n EntityMS(entity=${metadata.name},  initialIdList=${initialIdList})`);
    const elKey =` Entity(${metadata.name},${initialIdList.toString()})`;

    return (
        <>TestMultiSelect
            <CommandContextProvider>
                    {/*<div>{metadata.name}</div>*/}
                    <SummaryListMultiSelect metadata={metadata}
                                            initialIdList={initialIdList}
                                            receiver={'EntityMS'}
                                            UICues={{small: true, hasFocus: false}}
                                            key={elKey}
                                            elKey={elKey}
                    />
            </CommandContextProvider>
        </>
    );
}
