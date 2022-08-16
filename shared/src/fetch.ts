import endpoint from "../../endpoints.json";
import { getAuthToken, isAuthenticated } from "./auth";

export interface Error<T> {
  message?: string;
  error: T;
}

const fetch = async <T = Object>(
  resource: string,
  init?: RequestInit
): Promise<T> => {
  if (isAuthenticated()) {
    init = init || {};
    init.headers = {
      ...(init.headers || {}),
      Authorization: "Bearer " + getAuthToken()!,
    };
  }
  const req = await window.fetch(endpoint.API_ENDPOINT + resource, init);
  const json = (await req.json()) as T;
  if (req.status != 200) throw json;
  return json;
};

export const withOptions = (
  method: "POST" | "PATCH" | "PUT",
  obj: Object
): RequestInit => ({
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(obj),
});

export default fetch;
