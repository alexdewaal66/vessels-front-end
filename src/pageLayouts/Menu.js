import React, { Fragment } from 'react';
import menuStyles from './menu.module.css';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { hints, text } from '../helpers';
import { sessionConfig } from '../helpers/globals/sessionConfig';
import { hasAccess } from '../helpers/globals/levels';
import { NavLink } from 'react-router-dom';
import { logCondition, logv, rootMkr } from '../dev/log';
import { useAccessStatus } from '../helpers/useAccessStatus';

export function isNotDevItemOrEnabledDevItem(menuItem) {
    return !menuItem.dev || (menuItem.dev && sessionConfig.devComponents.value);
}

const activeClassName = ({isActive}) => isActive ? menuStyles.selected : undefined;

export function Menu({menuItems, className, ...rest}) {
    const page = menuItems?.pageName;
    const logRoot = rootMkr(Menu, page);
    const doLog = logCondition(Menu, page);
    if (doLog) logv(logRoot, {menuItems});

    const {userAuthorities} = useAccessStatus();

    // const location = useLocation();
    // const pagePath = '/' + location.pathname.split('/')[1];

    // let counter = 1;

    return (
        <>
            <nav className={pageLayout.menu} {...rest}>
                <div className={menuStyles.nav}>

                    <ul className={menuStyles.ul}>
                        {menuItems?.map(menuItem =>
                            (isNotDevItemOrEnabledDevItem(menuItem) && hasAccess(userAuthorities, menuItem.access)) &&
                            (menuItem.separator
                                ? (
                                    <React.Fragment key={page + menuItem.label}>
                                        <hr className={menuStyles.hr}/>
                                    </React.Fragment>
                                ) : (
                                    <Fragment key={page + menuItem.name + menuItem?.id || '' + '-menuFragment'}>
                                        <li key={page + menuItem.name} title={hints(menuItem.name)}>
                                            <NavLink
                                                to={menuItem.name + ((menuItem.id != null) ? ('/' + menuItem.id) : '')}
                                                className={activeClassName}
                                            >
                                                {text(menuItem.label)}
                                            </NavLink>
                                        </li>
                                    </Fragment>
                                ))
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
}
