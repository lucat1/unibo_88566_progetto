"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.removeAuthToken = exports.setAuthToken = exports.getAuthToken = exports.isAuthenticated = void 0;
const fetch_1 = __importDefault(require("./fetch"));
const AUTH_TOKEN_KEY = "auth";
const isAuthenticated = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY) != null;
};
exports.isAuthenticated = isAuthenticated;
const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};
exports.getAuthToken = getAuthToken;
const setAuthToken = (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
};
exports.setAuthToken = setAuthToken;
const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};
exports.removeAuthToken = removeAuthToken;
const me = async () => {
    if (!(0, exports.isAuthenticated)())
        return null;
    return await (0, fetch_1.default)("auth/me");
};
exports.me = me;
//# sourceMappingURL=auth.js.map