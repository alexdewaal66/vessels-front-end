import React from 'react';
import menuStyles from './menu.module.css';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { config } from '../helpers';

export function Menu({menuItems, choice, makeChoice, children, className, ...rest}) {

    return (
        <nav className={pageLayout.menu} {...rest}>
            {children}
            <div className={menuStyles.nav}>
                {/*<h4>Gegevens:</h4>*/}

                <ul className={menuStyles.ul}>
                    {menuItems?.map(menuItem =>
                        (!menuItem.dev || (menuItem.dev && config.devComponents.value)) &&
                        <li key={menuItem.label}
                            onClick={makeChoice(menuItem)}
                            className={choice === menuItem
                                ? menuStyles.selected
                                : null
                            }
                        >
                            {menuItem.label}
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

// (!dev || dev && value) && <li></li>