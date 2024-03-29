import { h, render } from "./h";
import { Router, Route, redirect, urlContext, resolveURL } from "./router.js";

import { me } from "shared/auth";
import { user as userContext } from "./ctxs";

import Nav from "./components/nav";

import Index from "./pages/index";
import Login from "./pages/login";
import Categories from "./pages/categories";
import CategoryAdd from "./pages/category-add";
import Category from "./pages/category";
import SubcategoryAdd from "./pages/subcategory-add";
import Subcategory from "./pages/subcategory";
import NotFound from "./pages/not-found";
import Pets from "./pages/pets";
import PetAdd from "./pages/pet-add";
import Pet from "./pages/pet";
import Products from "./pages/products";
import ProductAdd from "./pages/product-add";
import Product from "./pages/product";
import Services from "./pages/services";
import ServiceAdd from "./pages/service-add";
import Service from "./pages/service";
import Stores from "./pages/stores";
import StoreAdd from "./pages/store-add";
import Store from "./pages/store";
import Orders from "./pages/orders";
import Order from "./pages/order";
import BoardAdd from "./pages/board-add";
import Boards from "./pages/boards";
import Board from "./pages/board";
import Users from "./pages/users";
import User from "./pages/user";

let user = await me();
if (user) userContext.set(user);

const check = () => {
  const url = urlContext.val();
  const user = userContext.val();
  if (!user && url != resolveURL("/login")) redirect("/login");
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
          path: /^\/categories$/,
          element: h(Categories, {}),
        }),
        h(Route, {
          path: /^\/categories\/add$/,
          element: h(CategoryAdd, {}),
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
        h(Route, {
          path: /^\/pets$/,
          element: h(Pets, {}),
        }),
        h(Route, {
          path: /^\/pets\/add$/,
          element: h(PetAdd, {}),
        }),
        h(Route, {
          path: /^\/pets\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
          element: h(Pet, {}),
        }),
        h(Route, {
          path: /^\/products$/,
          element: h(Products, {}),
        }),
        h(Route, {
          path: /^\/products\/add$/,
          element: h(ProductAdd, {}),
        }),
        h(Route, {
          path: /^\/products\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
          element: h(Product, {}),
        }),
        h(Route, {
          path: /^\/services$/,
          element: h(Services, {}),
        }),
        h(Route, {
          path: /^\/services\/add$/,
          element: h(ServiceAdd, {}),
        }),
        h(Route, {
          path: /^\/services\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
          element: h(Service, {}),
        }),
        h(Route, {
          path: /^\/stores$/,
          element: h(Stores, {}),
        }),
        h(Route, {
          path: /^\/stores\/add$/,
          element: h(StoreAdd, {}),
        }),
        h(Route, {
          path: /^\/stores\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
          element: h(Store, {}),
        }),
        h(Route, {
          path: /^\/orders$/,
          element: h(Orders, {}),
        }),
        h(Route, {
          path: /^\/orders\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
          element: h(Order, {}),
        }),
        h(Route, {
          path: /^\/boards\/add$/,
          element: h(BoardAdd, {}),
        }),
        h(Route, {
          path: /^\/boards$/,
          element: h(Boards, {}),
        }),
        h(Route, {
          path: /^\/boards\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
          element: h(Board, {}),
        }),
        h(Route, {
          path: /^\/users$/,
          element: h(Users, {}),
        }),
        h(Route, {
          path: /^\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
          element: h(User, {}),
        }),
        h(Route, { path: /^.*$/, element: h(NotFound, {}) })
      )
    ),
  ],
  document.getElementById("root")
);
