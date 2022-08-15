<script lang="ts">
import { defineComponent } from "vue";
import Index from "./Index.vue";
import NotFound from "./NotFound.vue";
import Nav from "./Nav.vue";

import Quiz from "./Quiz.vue";

const routes: { [key: string]: any } = {
  "/": Index,
  "/quiz": Quiz,
};

export default defineComponent({
  data() {
    return {
      currentPath: window.location.hash,
    };
  },
  components: {
    Nav,
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || "/"] || NotFound;
    },
  },
  mounted() {
    window.addEventListener("hashchange", () => {
      this.currentPath = window.location.hash;
    });
  },
});
</script>

<template>
  <Nav />
  <div class="container">
    <router-view />
  </div>
</template>
