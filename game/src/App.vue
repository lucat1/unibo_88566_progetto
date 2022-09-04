<script lang="ts">
import { defineComponent } from "vue";

import { useAuth } from "./auth";
import Nav from "./components/Nav.vue";

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
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
        <template #fallback>
          <progress class="progress is-primary" />
        </template>
      </Suspense>
    </router-view>
  </main>
</template>
