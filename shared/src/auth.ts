import type { IUser } from "./models/user";
import fetch from "./fetch";

const AUTH_TOKEN_KEY = "auth";

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_TOKEN_KEY) != null;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const deleteAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const me = async (): Promise<IUser | null> => {
  if (!isAuthenticated()) return null;
  return await fetch<IUser>("auth/me");
};
