<script lang="ts">
import { defineComponent } from "vue";
import App from "./App";

export default defineComponent({ components: { App } });
</script>

<template>
  <Suspense>
    <App />
  </Suspense>
</template>
