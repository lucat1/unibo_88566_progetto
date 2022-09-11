import { h, useState } from "../h";
import { Link, navigate } from "../router";
import { useContext } from "../ctx";
import { user as userContext } from "../ctxs";
import { removeAuthToken } from "shared/auth";

const links = ["Categories", "Products", "Pets", "Stores"];

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
      h(Link, { to: "/", className: "navbar-item" },
      h(
        "img",
        { alt: "Animal House Logo", src: "/logo.png", class: "mr-4"},
      ),
      "Animal House Backoffice"
      )
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
                      removeAuthToken();
                      setUser(null);
                      navigate("/login");
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
