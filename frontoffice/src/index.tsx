import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthContextProvider } from "./auth";
import App from "./components/app";

import Index from "./pages/index";
import Login from "./pages/login";
import NotFound from "./pages/not-found";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <BrowserRouter>
      <App>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </App>
    </BrowserRouter>
  </AuthContextProvider>
);
