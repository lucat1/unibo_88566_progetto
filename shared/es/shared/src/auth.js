import fetch from "./fetch";
const AUTH_TOKEN_KEY = "auth";
export const isAuthenticated = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY) != null;
};
export const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};
export const setAuthToken = (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
};
export const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};
export const me = async () => {
    if (!isAuthenticated())
        return null;
    return await fetch("auth/me");
};
//# sourceMappingURL=auth.js.map