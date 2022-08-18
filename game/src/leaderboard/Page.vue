<script lang="ts">
import { defineComponent } from "vue";
import fetch from "shared/fetch";
import type { IGameScorePaginated } from "shared/models/game-score";

export default defineComponent({
  props: {
    page: Number,
    limit: Number,
    game: String,
  },
  async data() {
    const { pages, docs } = await fetch<IGameScorePaginated>(
      `game/leaderboad/${this.game}?page=${this.page}&limit=${this.limit}`
    );
    this.$emit("pagescount", pages);
    return docs;
  },
});
</script>

<template></template>
