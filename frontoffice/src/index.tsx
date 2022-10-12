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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </App>
      </BrowserRouter>
    </QueryClientProvider>
  </AuthContextProvider>
);
