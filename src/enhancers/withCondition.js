import React from 'react';

export const withCondition = BaseComponent => ({condition, children, ...rest}) =>
    (
        <>
            {condition &&
            <BaseComponent {...rest}>
                {children}
            </BaseComponent>
            }
        </>
    );
