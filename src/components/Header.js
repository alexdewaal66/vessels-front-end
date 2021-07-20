import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { pages } from '../pages';
import headerStyles from './header.module.css'
import layout from '../pageLayouts/layout.module.css';
import { AuthContext } from '../contexts/AuthContext';
import { withCondition } from '../enhancers/withCondition';


const CondLi = withCondition('li');

function Header() {
    const {user} = useContext(AuthContext);

    return (
        <nav className={layout.header}>
            <div className={headerStyles.nav}>
                <h3 className={headerStyles.title}>Vessels</h3>

                <ul className={headerStyles.ul}>
                    <li>
                        <NavLink to={pages.home.path} exact activeClassName={headerStyles.selected}>Home</NavLink>
                    </li>

                    <CondLi condition={user}>
                        <NavLink to={pages.entity.path} activeClassName={headerStyles.selected}>Entiteit</NavLink>
                    </CondLi>

                    <CondLi condition={!user}>
                        <NavLink to={pages.signUp.path} activeClassName={headerStyles.selected}>Registreren</NavLink>
                    </CondLi>

                    <CondLi condition={!user}>
                        <NavLink to={pages.signIn.path} activeClassName={headerStyles.selected}>Inloggen</NavLink>
                    </CondLi>

                    <CondLi condition={user}>
                        <NavLink to={pages.signOut.path} activeClassName={headerStyles.selected}>Uitloggen</NavLink>
                    </CondLi>

                    <CondLi condition={user}>
                        <NavLink to={pages.profile.path} activeClassName="active-link">Profiel</NavLink>
                    </CondLi>
                </ul>
            </div>

        </nav>
    );
};

export default Header;
