import React from 'react';
import { logCondition, logv, rootMkr } from '../dev/log';
import { text } from '../helpers';

export function ValidationMessage({form, fieldName}) {
    const logRoot = rootMkr(ValidationMessage);
    const doLog = logCondition(ValidationMessage, fieldName);
    const formState = {...form.formState};
    if (doLog) logv(logRoot, {fieldName, formState}, '👀');
    return <span style={{color: 'red', fontSize: 'smaller'}}>
                {text(form.formState.errors?.[fieldName]?.message)}
            </span>;
}
