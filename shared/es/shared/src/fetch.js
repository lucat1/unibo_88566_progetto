import { API_ENDPOINT } from "./endpoints";
import { getAuthToken, isAuthenticated } from "./auth";
const fetch = async (resource, init) => {
    if (isAuthenticated()) {
        init = init || {};
        init.headers = {
            ...(init.headers || {}),
            Authorization: "Bearer " + getAuthToken(),
        };
    }
    const req = await window.fetch(API_ENDPOINT + resource, init);
    const json = (await req.json());
    if (req.status != 200)
        throw json;
    return json;
};
const JSON_MIME = "application/json";
export const withOptions = (method, obj) => ({
    method,
    headers: {
        "Content-Type": JSON_MIME,
        Accept: JSON_MIME,
    },
    body: JSON.stringify(obj),
});
export default fetch;
//# sourceMappingURL=fetch.js.map