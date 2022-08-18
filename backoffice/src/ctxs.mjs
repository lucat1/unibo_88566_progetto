import { isAuthenticated } from "shared/auth";
import { createContext } from "./ctx";

export const user = createContext(
  isAuthenticated() ? { username: "loading" } : null
);
