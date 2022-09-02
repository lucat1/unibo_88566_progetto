"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withOptions = void 0;
const endpoints_1 = require("./endpoints");
const auth_1 = require("./auth");
const fetch = async (resource, init) => {
    if ((0, auth_1.isAuthenticated)()) {
        init = init || {};
        init.headers = {
            ...(init.headers || {}),
            Authorization: "Bearer " + (0, auth_1.getAuthToken)(),
        };
    }
    const req = await window.fetch(endpoints_1.API_ENDPOINT + resource, init);
    const json = (await req.json());
    if (req.status != 200)
        throw json;
    return json;
};
const JSON_MIME = "application/json";
const withOptions = (method, obj) => ({
    method,
    headers: {
        "Content-Type": JSON_MIME,
        Accept: JSON_MIME,
    },
    body: JSON.stringify(obj),
});
exports.withOptions = withOptions;
exports.default = fetch;
//# sourceMappingURL=fetch.js.map