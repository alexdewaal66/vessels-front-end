import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { pageObjects } from '../pages';
import headerStyles from './header.module.css'
import layout from '../pageLayouts/layout.module.css';
import { AuthContext } from '../contexts/AuthContext';
import { withCondition } from '../enhancers/withCondition';


const IfLi = withCondition('li');

function Header() {
    const {user} = useContext(AuthContext);

    return (
        <nav className={layout.header}>
            <div className={headerStyles.nav}>
                <h4 className={headerStyles.title}>Vessels</h4>

                <ul className={headerStyles.ul}>
                    <li>
                        <NavLink to={pageObjects.home.path} exact activeClassName="active-link">Home</NavLink>
                    </li>

                    <IfLi condition={user}>
                        <NavLink to={pageObjects.entity.path} activeClassName="active-link">Entiteit</NavLink>
                    </IfLi>

                    <li>
                        <NavLink to={pageObjects.signUp.path} activeClassName="active-link">Registreren</NavLink>
                    </li>

                    <li>
                        <NavLink to={pageObjects.signIn.path} activeClassName="active-link">Inloggen</NavLink>
                    </li>

                    <IfLi condition={user}>
                        <NavLink to={pageObjects.profile.path} activeClassName="active-link">Profiel</NavLink>
                    </IfLi>
                </ul>
            </div>

        </nav>
    );
};

export default Header;
