import { logCondition, logv, rootMkr } from '../dev/log';
import { Route, Routes } from 'react-router-dom';
import { isNotDevItemOrEnabledDevItem } from '../pageLayouts';
import { hasAccess } from '../helpers/globals/levels';
import React, { Fragment } from 'react';
import { useAccessStatus } from '../helpers/useAccessStatus';

export function PageRoutes({menuItems}) {
    const logRoot = rootMkr(PageRoutes, menuItems.pageName);
    const doLog = logCondition(PageRoutes, menuItems.pageName);
    const {userAuthorities} = useAccessStatus();

    return <Routes>
        {menuItems.map((menuItem, index) => {
            if (menuItem.separator) return;
            const {Component} = menuItem;
            if (!Component) {//something's wrong
                if (doLog) logv(logRoot, {menu: menuItems, menuItem, index}, 'Geen Component');
                return;
            }
            return (isNotDevItemOrEnabledDevItem(menuItem) &&
                hasAccess(userAuthorities, menuItem.access) &&
                !menuItem.separator &&
                <Fragment key={menuItem.name + '-fragment'}>
                    {menuItem.isDefault &&
                        <Route index element={<Component/>} key={menuItem.name + '-idx'}/>}
                    <Route path={menuItem.path || menuItem.name}
                           element={<Component/>}
                           key={menuItem.name}/>
                </Fragment>
            )
        })}
    </Routes>

}
