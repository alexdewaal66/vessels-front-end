import React from 'react';
import { now } from '../helpers/utils';
import styles from './onfocusexample.module.css'

export function OnFocusExample({children, className, ...rest}) {

    function logTargets(e, m) {
        console.log(now() + m,
            '\n\te.target=       ', e.target,
            '\n\te.currentTarget=', e.currentTarget,
            '\n\te.relatedTarget=', e.relatedTarget);
    }

    function handleFocus(e) {
        if (e.currentTarget === e.target) {
            logTargets(e, ' F - focused self');
        } else {
            logTargets(e, ' F - focused child');
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
            // Not triggered when swapping focus between children
            logTargets(e, ' F - focus entered self');
        }
    }

    function handleBlur(e) {
        if (e.currentTarget === e.target) {
            logTargets(e, ' B - unfocused self');
        } else {
            logTargets(e, ' B - unfocused child');
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
            // Not triggered when swapping focus between children
            logTargets(e, ' B - focus left self');
        }
    }

    return (
        <div className={styles.onfocus}
             tabIndex={1}
             onFocus={handleFocus}
             onBlur={handleBlur}
        >
            <input id="1"/>
            <input id="2"/>
        </div>
    );
}