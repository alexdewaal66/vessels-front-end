import React from 'react';
import { logCondition, logv, rootMkr } from '../dev/log';
import { text, useMountEffect } from '../helpers';
import { formStyles } from '../formLayouts';

export function ValidationMessage({form, fieldName}) {
    const logRoot = rootMkr(ValidationMessage);
    const doLog = logCondition(ValidationMessage, fieldName);
    const {formState, formState: {errors}, trigger} = form;

    useMountEffect(() => {trigger(fieldName).then();});

    if (doLog) logv(logRoot,
        {
            fieldName,
            formStateCopy: {...formState},
            [`errors.${fieldName}`]: errors[fieldName],
        },
        '👀');

    return <span className={formStyles.error}>
                {text(errors?.[fieldName]?.message)}
            </span>;
}
