import React, { useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { pages } from '../pages';
import headerStyles from './header.module.css'
import { pageLayout } from './';
import { AuthContext } from '../contexts';
import { withCondition } from '../enhancers/withCondition';
import { cx, hints, text } from '../helpers';
import { hasAccess } from '../helpers/globals/levels';


const CondLi = withCondition('li');

const projectHints = {
  NL: 'Eisen aan Frontend Eindopdracht',
  EN: 'Requirements on Final Assignment',
};

export function Header({className}) {
    const authorization = useContext(AuthContext);
    const {user} = authorization;
    const userAuthorities = useMemo(() => authorization.getRoles(), [authorization]);

    return (
        <nav className={cx(pageLayout.header, className)}>
            <div className={headerStyles.nav}>
                <NavLink to="/project" exact={true} activeClassName={headerStyles.selected}
                         title={hints(projectHints)}
                >
                    <h3 className={headerStyles.title}>Vessels</h3>
                </NavLink>

                <ul className={headerStyles.ul}>
                    {pages.displayOrder.map(page =>
                        <CondLi condition={page.isVisible(user) && hasAccess(userAuthorities, page.access)}
                                key={text(page.label)}
                        >
                            <NavLink to={page.path} exact={page.exact}
                                     activeClassName={headerStyles.selected}
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
