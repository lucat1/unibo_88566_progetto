<script lang="ts">
import { defineComponent } from "vue";
import fetch from "shared/fetch";
import type { IGameScorePaginated } from "shared/models/game-score";

export default defineComponent({
  emits: ["pagescount"],
  props: {
    page: Number,
    limit: Number,
    game: String,
  },
  async setup(props, context) {
    const { pages, docs } = await fetch<IGameScorePaginated>(
      `game/leaderboard/${props.game}?page=${props.page}&limit=${props.limit}`
    );
    context.emit("pagescount", pages);
    return { docs };
  },
});
</script>

<template>
  <table
    class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
  >
    <thead>
      <tr>
        <th>#</th>
        <th>User</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, i) in docs">
        <td>{{ limit * (page - 1) + i + 1 }}</td>
        <td>{{ entry.user }}</td>
        <td>{{ entry.score }}</td>
      </tr>
    </tbody>
  </table>
</template>
