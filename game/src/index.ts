import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
const vue = await import("@formkit/vue");

createApp(App).use(router).use(vue.plugin, vue.defaultConfig).mount("#root");
