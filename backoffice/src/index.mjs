import { h, render } from "./h";
import { Router, Route } from "./router.js";

import { me } from "shared/auth";
import { user as userContext } from "./ctxs";

import Nav from "./components/nav";
import Index from "./pages/index";
import Login from "./pages/login";
import Categories from "./pages/categories";
import CategoryAdd from "./pages/category-add";
import Category from "./pages/category";
import NotFound from "./pages/not-found";

render(
  [
    h(Nav, {}),
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
      h(Route, { path: /^.*$/, element: h(NotFound, {}) })
    ),
  ],
  document.getElementById("root")
);

let user = await me();
if (user) userContext.set(user);
