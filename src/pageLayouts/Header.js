import React, { useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { pages, appNamePage } from '../pages/pages';
import headerStyles from './header.module.css'
import { pageLayout } from './';
import { AuthContext } from '../contexts';
import { withCondition } from '../enhancers/withCondition';
import { cx, hints, text } from '../helpers';
import { hasAccess } from '../helpers/globals/levels';


const CondLi = withCondition('li');


const activeClassName = ({isActive}) => isActive ? headerStyles.selected : undefined;

export function Header({className}) {
    const authorization = useContext(AuthContext);
    const {user} = authorization;
    const userAuthorities = useMemo(() => authorization.getRoles(), [authorization]);

    return (
        <nav className={cx(pageLayout.header, className)}>
            <div className={headerStyles.nav}>
                <NavLink to={appNamePage.path}
                         className={activeClassName}
                         title={hints(appNamePage.hints)}
                >
                    <h3 className={headerStyles.title}>Vessels</h3>
                </NavLink>

                <ul className={headerStyles.ul}>
                    {pages.displayOrder.map(page =>
                        <CondLi condition={page.isVisible(user) && hasAccess(userAuthorities, page.access)}
                                key={text(page.label)}
                        >
                            <NavLink to={page.path} exact={page.exact}
                                     className={activeClassName}
                                     title={hints(page.hints)}
                            >
                                {text(page.label)}
                            </NavLink>
                        </CondLi>
                    )}
                </ul>
            </div>
        </nav>
    );
}
