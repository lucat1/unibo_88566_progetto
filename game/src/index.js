import { createApp } from "vue";
const vue = await import("@formkit/vue");
import { createPinia } from "pinia";
import router from "./router";
import AppWrapper from "./AppWrapper.vue";
createApp(AppWrapper)
    .use(router)
    .use(createPinia())
    .use(vue.plugin, vue.defaultConfig)
    .mount("#root");
