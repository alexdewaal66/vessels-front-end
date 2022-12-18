import React, { useContext, useMemo } from 'react';
import menuStyles from './menu.module.css';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { text } from '../helpers';
import { sessionConfig } from '../helpers/globals/sessionConfig';
import { hasAccess } from '../helpers/globals/levels';
import { AuthContext } from '../contexts';

function isNotDevItemOrEnabledDevItem(menuItem) {
    return !menuItem.dev || (menuItem.dev && sessionConfig.devComponents.value);
}

export function Menu({menuItems, choice, makeChoice, children, className, ...rest}) {
    const authorization = useContext(AuthContext);
    const userAuthorities = useMemo(() => authorization.getRoles(), [authorization]);

    let counter=1;

    return (
        <nav className={pageLayout.menu} {...rest}>
            {children}
            <div className={menuStyles.nav}>
                {/*<h4>Gegevens:</h4>*/}

                <ul className={menuStyles.ul}>
                    {menuItems?.map(menuItem =>
                        (isNotDevItemOrEnabledDevItem(menuItem) && hasAccess(userAuthorities, menuItem.access)) &&
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