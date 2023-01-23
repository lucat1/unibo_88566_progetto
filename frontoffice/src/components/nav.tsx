import * as React from "react";
import { Link } from "react-router-dom";
import { removeAuthToken } from "shared/auth";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";

import useCart from "../cart";
import { useAuth } from "../auth";
import { pages } from "../pages/index";

const Nav: React.FC = () => {
  const [opened, setOpened] = React.useState(false);
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const productsInCart = React.useMemo(
    () => cart.reduce((prev, item) => prev + item.amount, 0),
    [cart]
  );
  const logout = React.useCallback(() => {
    removeAuthToken();
    setAuth(false);
  }, [removeAuthToken, setAuth]);
  return (
    <nav
      className="navbar is-info"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img
            alt="Animal House Logo"
            src={`${FRONTOFFICE_ENDPOINT}logo.png`}
            className="mr-4"
          />
          Animal House Frontoffice
        </Link>

        <a
          role="button"
          className={`navbar-burger ${opened ? "is-active" : ""}`}
          onClick={() => setOpened(!opened)}
          onKeyPress={() => setOpened(!opened)}
          aria-label="expand menu"
          aria-expanded={opened ? "true" : "false"}
          data-target="nav"
          tabIndex={0}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="nav"
        aria-label="menu"
        aria-expanded={opened ? "true" : "false"}
        className={`navbar-menu ${opened ? "is-active" : ""}`}
      >
        <div className="navbar-start">
          {pages.map((page, i) => (
            <Link key={i} to={page.url} className="navbar-item">
              {page.name}
            </Link>
          ))}
        </div>

        <div className="navbar-end">
          <Link to="/cart" className="navbar-item">
            <span className="icon-text">
              <span className="file-icon">
                <i className="fa-solid fa-cart-shopping"></i>
              </span>
              <span>Chart ({productsInCart})</span>
            </span>
          </Link>
          {auth.authenticated ? (
            <>
              <Link className="navbar-item" to={`/users/${auth.user?._id}`}>
                {auth.user?.username}
              </Link>
              <div className="navbar-item">
                <div className="buttons">
                  <button onClick={logout} className="button is-light-info">
                    Log out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="navbar-item">
              <div className="buttons">
                <Link to="/register" className="button is-info">
                  <strong>Sign up</strong>
                </Link>
                <Link to="/login" className="button is-light-info">
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
