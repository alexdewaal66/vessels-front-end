import React from 'react';
import { now } from '../helpers';
import focusStyles from './onfocusexample.module.css'

export function OnFocusExample({children, className, ...rest}) {

    function logTargets(e, m) {
        console.log(now() + m,
            '\n\t e.target=       ', e.target,
            '\n\t e.currentTarget=', e.currentTarget,
            '\n\t e.relatedTarget=', e.relatedTarget);
    }

    function handleFocus(e) {
        if (e.currentTarget === e.target) {
            logTargets(e, ' onFocus - focused self');
        } else {
            logTargets(e, ' onFocus - focused child');
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
            // Not triggered when swapping focus between children
            logTargets(e, ' onFocus - focus entered self');
        }
    }

    function handleBlur(e) {
        if (e.currentTarget === e.target) {
            logTargets(e, ' onBlur - unfocused self');
        } else {
            logTargets(e, ' onBlur - unfocused child');
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
            // Not triggered when swapping focus between children
            logTargets(e, ' onBlur - focus left self');
        }
    }

    return (
        <>
            <div id="A"
                 className={focusStyles.onfocus}
                 tabIndex={1}
                 onFocus={handleFocus}
                 onBlur={handleBlur}
            >
                <input id="A1"/>
                <input id="A2"/>
            </div>
            <div id="B"
                 className={focusStyles.onfocus}
                 tabIndex={1}
                 onFocus={handleFocus}
                 onBlur={handleBlur}
            >
                <input id="B1"/>
                <input id="B2"/>
            </div>
        </>
    );
}