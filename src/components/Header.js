import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { pages } from '../pages';
import headerStyles from './header.module.css'
import layout from '../layouts/layout.module.css';

function Header() {
  const history = useHistory();

  return (
    <nav className={layout.header}>
      <div className={headerStyles.nav}>
        <h4 className={headerStyles.title}>Vessels</h4>

        <ul className={headerStyles.ul}>
          <li>
            <NavLink to={pages.Home} exact activeClassName="active-link">Home</NavLink>
          </li>

          <li>
            <NavLink to={pages.SignUp} activeClassName="active-link">Registreren</NavLink>
          </li>

          <li>
            <NavLink to={pages.SignIn} activeClassName="active-link">Inloggen</NavLink>
          </li>

          <li>
            <NavLink to={pages.Profile} activeClassName="active-link">Profiel</NavLink>
          </li>
        </ul>
      </div>

    </nav>
  );
};

export default Header;

/*
     <div>
        <button
            type="button"
            onClick={() => history.push(pages.Home)}
        >
          Home
        </button>
        <button
            type="button"
            onClick={() => history.push(pages.SignIn)}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => history.push(pages.SignUp)}
        >
          Registreren
        </button>
      </div>

 */