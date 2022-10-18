import React from 'react';
import menuStyles from './menu.module.css';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { text, sessionConfig } from '../helpers';

export function Menu({menuItems, choice, makeChoice, children, className, ...rest}) {

    let counter=1;

    return (
        <nav className={pageLayout.menu} {...rest}>
            {children}
            <div className={menuStyles.nav}>
                {/*<h4>Gegevens:</h4>*/}

                <ul className={menuStyles.ul}>
                    {menuItems?.map(menuItem =>
                        (!menuItem.dev || (menuItem.dev && sessionConfig.devComponents.value)) &&
                        (menuItem.separator
                            ? (
                                <React.Fragment key={menuItem.label + counter++}>
                                    <hr className={menuStyles.hr}/>
                                </React.Fragment>
                            ) : (
                                <li key={menuItem.label + counter++}
                                    onClick={makeChoice(menuItem)}
                                    className={choice === menuItem
                                        ? menuStyles.selected
                                        : null
                                    }
                                >
                                    {text(menuItem.label)}
                                </li>
                            ))
                    )}
                </ul>
            </div>
        </nav>
    );
}

// (!dev || dev && value) && <li></li>