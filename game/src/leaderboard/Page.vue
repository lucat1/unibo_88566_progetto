<script lang="ts">
import { defineComponent, watch, ref } from "vue";
import fetch from "shared/fetch";
import type { IGameScorePaginated } from "shared/models/game-score";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";

export default defineComponent({
  emits: ["pagescount"],
  props: {
    page: Number,
    limit: Number,
    game: String,
  },
  async setup(props, context) {
    const f = async (game: string, page: number, limit: number) => {
      const { pages, docs } = await fetch<IGameScorePaginated>(
        `game/leaderboard/${game}?page=${page}&limit=${limit}`
      );
      context.emit("pagescount", pages);
      return docs.map((entry) => ({
        ...entry,
        profileUrl: FRONTOFFICE_ENDPOINT + "user/" + entry.user,
      }));
    };
    let docs = ref(await f(props.game!, props.page!, props.limit!));

    watch([props], async ([props]) => {
      docs.value = await f(props.game!, props.page!, props.limit!);
    });

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
        <td>
          <a :href="entry.profileUrl">{{ entry.username || "anonymous" }}</a>
        </td>
        <td>{{ entry.score }}</td>
      </tr>
    </tbody>
  </table>
</template>
