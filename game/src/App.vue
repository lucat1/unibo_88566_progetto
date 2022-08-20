<script lang="ts">
import { defineComponent } from "vue";
import Nav from "./Nav.vue";

import { useAuth } from "./auth";

export default defineComponent({
  async setup() {
    await useAuth().try();
  },
  components: {
    Nav,
  },
});
</script>

<template>
  <Nav />
  <main style="flex: 1" class="m-5">
    <Suspense>
      <router-view />
      <template #fallback>
        <progress class="progress is-primary is-widescreen" max="100">15%</progress>
      </template>
    </Suspense>
  </main>
</template>
