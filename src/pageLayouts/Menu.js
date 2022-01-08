import React from 'react';
import menuStyles from './menu.module.css';
import pageLayout from '../pageLayouts/pageLayout.module.css';


export function Menu({menuItems, choice, makeChoice, children, className, ...rest}) {

    return (
        <nav className={pageLayout.menu} {...rest}>
            {children}
            <div className={menuStyles.nav}>
                <h4>Gegevens:</h4>

                <ul className={menuStyles.ul}>
                    {menuItems?.map(menuItem =>
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

/*
                            <a className={choice.value === command
                                ? menuStyles.selected
                                : null
                            }>
                                {command.name}
                            </a>

                            <button type="button"
                                    className={menuStyles.linkButton}
                            >
                                {command.name}
                            </button>
 */