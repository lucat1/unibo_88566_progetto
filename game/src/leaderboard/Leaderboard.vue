<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    game: String,
    limit: {
      type: Number,
      default: 10,
    },
  },
  async data() {
    return {
      page: 0,
      max: 10,
    };
  },
  computed: {
    min() {
      return Math.max(0, this.page - 5);
    },
  },
  methods: {
    pagescount(i: number) {
      this.max = i;
    },
  },
});
</script>

<template>
  <h1>Leaderboard</h1>
  <Suspense>
    <Page @pagescount="pagescount" :page="page" :game="game" />

    <template #fallback> Loading... </template>
  </Suspense>
  <div>
    <button
      v-for="index in 10"
      :key="index"
      v-if="index > min + 1 && index < max + 1 && index < pages"
    >
      {{ index }}
    </button>
  </div>
</template>
