import React from 'react';
import { useHistory } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { pages } from '../pages';

function Header() {
  const history = useHistory();

  return (
    <header>
      <ul>
        <li>
          <NavLink to={pages.Home} exact activeClassName="active-link">Home</NavLink>
        </li>

        <li>
          <NavLink to={pages.SignIn} activeClassName="active-link">Inloggen</NavLink>
        </li>

        <li>
          <NavLink to={pages.SignUp} activeClassName="active-link">Registreren</NavLink>
        </li>

        <li>
          <NavLink to={pages.Profile} activeClassName="active-link">Profiel</NavLink>
        </li>
      </ul>
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
    </header>
  );
};

export default Header;