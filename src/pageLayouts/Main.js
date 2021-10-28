import React from 'react';
import layout from './pageLayout.module.css';
import { cx } from '../helpers';

export function Main({children, className, ...rest}) {
    return (
      <main className={cx(layout.main, className)} {...rest}>
          {children}
      </main>
    );
}