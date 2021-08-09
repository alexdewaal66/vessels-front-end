import React from 'react';
import { Input } from '../Input';
import { FieldEl, FieldRow, Fieldset } from '../../formLayouts';

export function ItemSummary2({metadata, item}) {
    const elKey = "ItemSummary2" + metadata.name;
    return (
        <Fieldset key={elKey}>
            {metadata.summary.map(propertyName =>
                <FieldRow key={elKey + propertyName}
                >
                    <FieldEl>
                        {metadata.properties[propertyName].label || propertyName}
                    </FieldEl>
                    <FieldEl>
                        <Input readOnly={true}
                               defaultValue={item[propertyName]}
                               metadata={metadata}
                               field={propertyName}
                               register={() => {
                               }}
                        />
                    </FieldEl>
                </FieldRow>
            )}
        </Fieldset>
    );
}

/*

 */