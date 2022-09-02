export interface Error<T> {
    message?: string;
    error: T;
}
declare const fetch: <T = Object>(resource: string, init?: RequestInit) => Promise<T>;
export declare const withOptions: (method: "POST" | "PATCH" | "PUT", obj: Object) => RequestInit;
export default fetch;
