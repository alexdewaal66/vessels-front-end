import React, { useState } from 'react';
import { SummaryListSmall } from '../components/summaryList';
import { entitiesMetadata } from '../helpers';
import { CommandContextProvider } from '../contexts/CommandContext';
import { logv, rootMkr } from './log';
import { Stringify } from './Stringify';

export function TestMultiSelect({metadata = entitiesMetadata.zyx, initialIdList = []}) {
    const logRoot = rootMkr(TestMultiSelect);
    logv(logRoot, {initialIdList});
    const elKey = ` Entity(${metadata.name},${initialIdList.toString()})`;
    const [hiddenField, setHiddenField] = useState();


    return (
        <>TestMultiSelect
            <CommandContextProvider>
                {/*<div>{metadata.name}</div>*/}
                <Stringify data={hiddenField}>hiddenField</Stringify>
                <SummaryListSmall metadata={metadata}
                                  initialIdList={initialIdList}
                                  receiver={'TestMultiSelect'}
                                  UICues={{hasFocus: false, isMulti: true}}
                                  key={elKey}
                                  elKey={elKey}
                                  setHiddenField={setHiddenField}
                />
            </CommandContextProvider>
        </>
    );
}
