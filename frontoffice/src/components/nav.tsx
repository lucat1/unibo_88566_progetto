import * as React from "react";
import { Link } from "react-router-dom";
import { removeAuthToken } from "shared/auth";

import { useAuth } from "../auth";
import { pages } from "../pages/index";

const Nav: React.FC = () => {
  const [opened, setOpened] = React.useState(false);
  const [auth, setAuth] = useAuth();
  const logout = React.useCallback(() => {
    removeAuthToken();
    setAuth(false);
  }, [removeAuthToken, setAuth]);
  return (
    <nav
      className="navbar is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img alt="Animal House Logo" src="/logo.png" className="mr-4" />
          Animal House Frontoffice
        </Link>

        <a
          role="button"
          className={`navbar-burger ${opened ? "is-active" : ""}`}
          onClick={() => setOpened(!opened)}
          aria-label="menu"
          aria-expanded="false"
          data-target="nav"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="nav" className={`navbar-menu ${opened ? "is-active" : ""}`}>
        <div className="navbar-start">
          {pages.map((page, i) => (
            <Link key={i} to={page.url} className="navbar-item">
              {page.name}
            </Link>
          ))}
        </div>

        <div className="navbar-end">
          {auth.authenticated ? (
            <div className="navbar-item">
              <Link
                className="mr-4 has-text-white"
                to={`/users/${auth.user._id}`}
              >
                {auth.user.username}
              </Link>
              <button onClick={logout} className="button is-light">
                Log out
              </button>
            </div>
          ) : (
            <div className="navbar-item">
              <div className="buttons">
                <Link to="/register" className="button is-primary">
                  <strong>Sign up</strong>
                </Link>
                <Link to="/login" className="button is-light">
                  Log in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
