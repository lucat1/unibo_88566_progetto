import { h, useState } from "../h";
import { Link, navigate } from "../router";
import { useContext } from "../ctx";
import { user as userContext } from "../ctxs";
import { removeAuthToken } from "shared/auth";
import { BACKOFFICE_ENDPOINT } from "shared/endpoints";

const links = [
  "Categories",
  "Products",
  "Services",
  "Pets",
  "Stores",
  "Orders",
  "Boards",
  "Users",
];

const Nav = () => {
  const [user, setUser] = useContext(userContext);
  const [open, setOpen] = useState(false);
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
      h(
        Link,
        { to: "/", className: "navbar-item" },
        h("img", {
          alt: "Animal House Logo",
          src: BACKOFFICE_ENDPOINT + "logo.png",
          class: "mr-4",
        }),
        "Animal House Backoffice"
      ),
      h(
        "a",
        {
          role: "button",
          className: `navbar-burger ${open ? "is-active" : ""}`,
          onClick: (_) => setOpen(!open),
          onkeypress: (_) => setOpen(!open),
          "aria-label": "expand menu",
          "aria-expand": open ? "true" : "false",
          "data-target": "nav",
          tabindex: "0",
        },
        h("span", { "aria-hidden": "true" }),
        h("span", { "aria-hidden": "true" }),
        h("span", { "aria-hidden": "true" })
      )
    ),
    h(
      "div",
      {
        id: "nav",
        "aria-label": "menu",
        "aria-expanded": open,
        className: `navbar-menu ${open ? "is-active" : ""}`,
      },
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
                { className: "buttons mr-4" },
                h(
                  Link,
                  { to: "/login", className: "button is-light", tabindex: "0" },
                  "Login"
                )
              )
            : h(
                "span",
                {},
                "Signed in as ",
                h(
                  "a",
                  {
                    onClick: () => navigate(`/users/${user._id}`),
                    onkeypress: () => navigate(`/users/${user._id}`),
                    tabindex: "0",
                  },
                  user.username
                ),
                ", ",
                h(
                  "a",
                  {
                    onClick: () => {
                      removeAuthToken();
                      setUser(null);
                      navigate("/login");
                    },
                    onkeypress: () => {
                      removeAuthToken();
                      setUser(null);
                      navigate("/login");
                    },
                    tabindex: "0",
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
