import endpoints from "../endpoints.json" assert { type: "json" };

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: "/" },
    src: { url: "/dist" },
  },
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-typescript"],
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
    port: 4000,
  },
  workspaceRoot: "..",
  buildOptions: {
    baseUrl: endpoints.FRONTOFFICE_ENDPOINT,
  },
};
