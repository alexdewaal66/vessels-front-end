import React from 'react';
import layout from '../../layout.module.css';

export function Main({children}) {
    return (
      <main className={layout.content}>
          {children}
      </main>
    );
}