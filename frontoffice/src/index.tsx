import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthContextProvider } from "./auth";
import App from "./components/app";

import Index from "./pages/index";
import Login from "./pages/login";
import Register from "./pages/register";
import User from "./pages/user";
import Products from "./pages/products";
import Product from "./pages/product";
import Pets from "./pages/pets";
import Pet from "./pages/pet";
import Cart from "./pages/cart";
import Orders from "./pages/orders";
import Order from "./pages/order";
import Boards from "./pages/boards";
import BoardAdd from "./pages/board-add";
import Board from "./pages/board";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App>
          <Routes>
            <Route index element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Product />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<Pet />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<Order />} />
            <Route path="/boards" element={<Boards />} />
            <Route path="/boards/add" element={<BoardAdd />} />
            <Route path="/boards/:id" element={<Board />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </App>
      </BrowserRouter>
    </QueryClientProvider>
  </AuthContextProvider>
);
