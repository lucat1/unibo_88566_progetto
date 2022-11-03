import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthContextProvider } from "./auth";
import App from "./components/app";

import Index from "./pages/index";
import Login from "./pages/login";
import User from "./pages/user";
import Products from "./pages/products";
import Product from "./pages/product";
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
            <Route path="/users/:id" element={<User />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Product />} />
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
