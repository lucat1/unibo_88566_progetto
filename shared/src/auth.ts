import type { IUser } from "./models/user";
import fetch from "./fetch";

const AUTH_TOKEN_KEY = "auth",
  UUIDKEY = "authuuid";

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_TOKEN_KEY) != null;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const me = async (): Promise<IUser | null> => {
  if (!isAuthenticated()) return null;
  return await fetch<IUser>("auth/me");
};

export const hasUUID = () => {
  return localStorage.getItem(UUIDKEY) != null;
};

export const setUUID = (uuid: string) => {
  return localStorage.setItem(UUIDKEY, uuid)!;
};

export const getUUID = (): string => {
  return localStorage.getItem(UUIDKEY)!;
};

export const removeUUID = () => {
  return localStorage.removeItem(UUIDKEY);
};
