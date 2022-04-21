import React from 'react';

export function ValidationMessage({form, fieldName}) {
    return <span style={{color: 'red', fontSize: 'smaller'}}>
                {form.formState.errors?.[fieldName]?.message}
            </span>;
}