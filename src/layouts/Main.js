import React from 'react';
import layout from './layout.module.css';

export function Main({children, ...rest}) {
    return (
      <main className={layout.content} {...rest}>
          {children}
      </main>
    );
}