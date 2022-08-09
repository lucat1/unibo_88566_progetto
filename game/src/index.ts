import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { plugin, defaultConfig } from "@formkit/vue";

createApp(App).use(router).use(plugin, defaultConfig).mount("#root");
