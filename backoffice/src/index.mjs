import { h, render } from "./h";
import { Router, Route, redirect, urlContext } from "./router.js";

import { me } from "shared/auth";
import { user as userContext } from "./ctxs";

import App from "./components/app";
import Nav from "./components/nav";

import Index from "./pages/index";
import Login from "./pages/login";
import Categories from "./pages/categories";
import CategoryAdd from "./pages/category-add";
import Category from "./pages/category";
import SubcategoryAdd from "./pages/subcategory-add";
import Subcategory from "./pages/subcategory";
import NotFound from "./pages/not-found";

let user = await me();
if (user) userContext.set(user);

const check = () => {
  const url = urlContext.val();
  const user = userContext.val();
  if (!user && url != "/login") redirect("/login");
};

urlContext.on(check);
check();

render(
  [
    h(Nav, {}),
    h(
      "main",
      { style: { flex: 1 }, className: "m-5" },
      h(
        Router,
        {},
        h(Route, { path: /^\/$/, element: h(Index, {}) }),
        h(Route, { path: /^\/login$/, element: h(Login, {}) }),
        h(Route, {
          path: /^\/categories\/add$/,
          element: h(CategoryAdd, {}),
        }),
        h(Route, {
          path: /^\/categories$/,
          element: h(Categories, {}),
        }),
        h(Route, {
          path: /^\/categories\/\d+$/,
          element: h(Category, {}),
        }),
        h(Route, {
          path: /^\/categories\/\d+\/add$/,
          element: h(SubcategoryAdd, {}),
        }),
        h(Route, {
          path: /^\/subcategories\/\d+$/,
          element: h(Subcategory, {}),
        }),
        h(Route, { path: /^.*$/, element: h(NotFound, {}) })
      )
    ),
  ],
  document.getElementById("root")
);
