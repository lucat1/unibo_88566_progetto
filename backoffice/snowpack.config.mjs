import { BACKOFFICE_ENDPOINT } from "../endpoints.mjs";

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: "/" },
    src: { url: "/dist" },
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: "routes", src: ".*", dest: "/index.html" },
  ],
  optimize: {
    /* If we were to deploy the site publicly this would be a performance improvement */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 5000,
  },
  buildOptions: {
    baseUrl: BACKOFFICE_ENDPOINT,
  },
};
