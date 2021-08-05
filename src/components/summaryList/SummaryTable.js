import React from 'react';
import { SummaryHeading, SummaryRow, summaryStyle } from './';
import { now } from '../../helpers/utils';

export function SummaryTable({list, metadata, setEntity}) {
    const entityName = metadata.name;
    console.log(now() +  ` entityName=`, entityName);

    return (
        <div className={summaryStyle.tableFixHead}>
            <table className={summaryStyle.table}>
                <thead>
                <SummaryHeading metadata={metadata} elKey={entityName}/>
                </thead>
                <tbody>
                {list.map(item => (
                    <SummaryRow item={item}
                                metadata={metadata}
                                setDetails={setEntity}
                                elKey={entityName + item.id}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}

