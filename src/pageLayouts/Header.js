import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { pages } from '../pages';
import headerStyles from './header.module.css'
import { pageLayout } from './';
import { AuthContext } from '../contexts/AuthContext';
import { withCondition } from '../enhancers/withCondition';
import { cx } from '../helpers';


const CondLi = withCondition('li');

export function Header({className}) {
    const {user} = useContext(AuthContext);

    return (
        <nav className={cx(pageLayout.header, className)}>
            <div className={headerStyles.nav}>
                <h3 className={headerStyles.title}>Vessels</h3>

                <ul className={headerStyles.ul}>
                    {pages.displayOrder.map(page =>
                        <CondLi condition={page.isVisible(user)}
                                key={page.name}
                        >
                            <NavLink to={page.path} exact={page.exact} activeClassName={headerStyles.selected}>
                                {page.name}
                            </NavLink>
                        </CondLi>
                    )}
                </ul>
            </div>
        </nav>
    );
}
