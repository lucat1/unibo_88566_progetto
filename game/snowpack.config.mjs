import endpoints from "../endpoints.json" assert { type: "json" };

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: "/" },
    src: { url: "/dist" },
  },
  plugins: ["@snowpack/plugin-vue", "@snowpack/plugin-typescript", "@snowpack/plugin-sass"],
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: "routes", src: ".*", dest: "/index.html" },
  ],
  optimize: {
    /* If we were to deploy the site publicly this would be a performance improvement */
    // "bundle": true,
  },
  devOptions: {
    port: 3000,
  },
  buildOptions: {
    baseUrl: endpoints.GAME_ENDPOINT,
  },
};
