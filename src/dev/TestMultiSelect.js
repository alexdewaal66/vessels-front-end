import React, { useState } from 'react';
import { SummaryListSmall } from '../components/summaryList';
import { entityTypes } from '../helpers';
import { CommandContextProvider } from '../contexts/CommandContext';
import { logv, rootMkr } from './log';
import { Stringify } from './Stringify';

export function TestMultiSelect({entityType = entityTypes.zyx, initialIdList = []}) {
    const logRoot = rootMkr(TestMultiSelect);
    logv(logRoot, {initialIdList});
    const elKey = ` Entity(${entityType.name},${initialIdList.toString()})`;
    const [hiddenField, setHiddenField] = useState();


    return (
        <>TestMultiSelect
            <CommandContextProvider>
                {/*<div>{entityType.name}</div>*/}
                <Stringify data={hiddenField}>hiddenField</Stringify>
                <SummaryListSmall entityType={entityType}
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
