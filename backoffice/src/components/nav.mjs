import { h, useState } from "../h";
import { Link } from "../router";
import { useContext } from "../ctx";
import { user as userContext } from "../ctxs";
import { deleteAuthToken } from "shared/auth";

const links = ["Categories", "Products"];

const Nav = () => {
  const [user, setUser] = useContext(userContext);
  return h(
    "nav",
    {
      className: "navbar is-primary",
      role: "navigation",
      "aria-label": "main navigation",
    },
    h(
      "div",
      { className: "navbar-brand" },
      // TODO: LOGO
      h(Link, { to: "/", className: "navbar-item" }, "Index")
    ),
    h(
      "div",
      { className: "navbar-menu" },
      h(
        "div",
        { className: "navbar-start" },
        links.map((product, i) =>
          h(
            Link,
            {
              key: i,
              to: `/${product.toLowerCase()}`,
              className: "navbar-item",
            },
            product
          )
        )
      ),
      h(
        "div",
        { className: "navbar-end" },
        h(
          "div",
          { className: "navbar-item" },
          !user
            ? h(
                "div",
                { className: "buttons" },
                h(Link, { to: "/login", className: "button is-light" }, "Login")
              )
            : h(
                "span",
                {},
                "Signed in as ",
                user.username,
                ", ",
                h(
                  "a",
                  {
                    onClick: () => {
                      deleteAuthToken();
                      setUser(null);
                    },
                  },
                  "Sign out"
                )
              )
        )
      )
    )
  );
};

export default Nav;
