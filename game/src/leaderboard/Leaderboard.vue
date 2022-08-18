<script lang="ts">
import { defineComponent } from "vue";
import Page from "./Page";

export default defineComponent({
  props: {
    game: String,
    limit: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      page: 1,
      max: 10,
    };
  },
  computed: {
    pages() {
      const min = Math.max(1, this.page - 5);
      return Array.from({ length: this.max - min }).map((_, i) => min + i);
    },
  },
  methods: {
    pagescount(i: number) {
      this.max = i;
    },
  },
  components: { Page },
});
</script>

<template>
  <h1>Leaderboard</h1>
  <Suspense>
    <Page @pagescount="pagescount" :page="page" :game="game" :limit="limit" />

    <template #fallback> Loading... </template>
  </Suspense>
  <div>
    <button v-for="index in pages" :key="index">
      {{ index }}
    </button>
  </div>
</template>
