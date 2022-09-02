import type { IUser } from "./models/user";
export declare const isAuthenticated: () => boolean;
export declare const getAuthToken: () => string | null;
export declare const setAuthToken: (token: string) => void;
export declare const removeAuthToken: () => void;
export declare const me: () => Promise<IUser | null>;
