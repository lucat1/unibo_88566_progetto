import { h, render } from "./h";
import { Router, Route, Link } from "./router.js";

import Nav from "./components/nav";
import Index from "./pages/index";
import Login from "./pages/login";
import NotFound from "./pages/not-found";

render(
  [
    h(Nav, {}),
    h(
      Router,
      {},
      h(Route, { path: /^\/$/, element: h(Index, {}) }),
      h(Route, { path: /^\/login$/, element: h(Login, {}) }),
      h(Route, { path: /^.*$/, element: h(NotFound, {}) })
    ),
  ],
  document.getElementById("root")
);
