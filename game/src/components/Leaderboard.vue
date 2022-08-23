<script lang="ts">
import { defineComponent } from "vue";

import Page from "./LeaderboardPage.vue";

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
      return Array.from({ length: this.max - min + 1 }).map((_, i) => min + i);
    },
  },
  methods: {
    pagescount(i: number) {
      this.max = i;
    },
    goto(i: number) {
      this.page = i;
    },
  },
  components: { Page },
});
</script>

<template>
  <Suspense>
    <Page @pagescount="pagescount" :page="page" :game="game" :limit="limit" />

    <template #fallback> Loading... </template>
  </Suspense>
  <div>
    <span class="subtitle">Pages:</span>
    <button
      class="button"
      :class="{ 'is-active': index == page }"
      v-for="index in pages"
      :key="index"
      @click="goto(index)"
    >
      {{ index }}
    </button>
  </div>
</template>
