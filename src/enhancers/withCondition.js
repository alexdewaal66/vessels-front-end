import React from 'react';

export const withCondition = BaseComponent => ({condition, children}) =>
    (
        <>
            {condition &&
            <BaseComponent>
                {children}
            </BaseComponent>
            }
        </>
    );