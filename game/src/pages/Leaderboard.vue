<script lang="ts">
import { defineComponent } from "vue";

import { GameType } from "shared/models/game-score";
import Leaderboard from "../components/Leaderboard.vue";

export default defineComponent({
  data() {
    const pages = Object.values(GameType);
    let current = this.$route.params.game;
    if (!pages.find((x) => x === current)) current = pages[0];
    return {
      pages,
      current,
      score: this.$route.query.score,
    };
  },
  watch: {
    "$route.params.game"(game) {
      this.current = game;
    },
    "$route.query.score"(score) {
      this.score = score;
    },
  },
  components: {
    Leaderboard,
  },
});
</script>

<template>
  <h1 class="title">Leaderboard</h1>
  <div v-if="score" class="notification is-link">Result: {{ score }}</div>
  <div class="tabs">
    <ul>
      <li v-for="page in pages" :class="page == current && 'is-active'">
        <router-link :to="'/leaderboard/' + page">{{
          page.charAt(0).toUpperCase() + page.slice(1)
        }}</router-link>
      </li>
    </ul>
  </div>
  <div class="block">
    <Leaderboard :game="current" :limit="5" />
  </div>
  <div class="block">
    <router-link
      v-if="score != undefined"
      :to="'/' + current"
      class="button is-link"
      >Retry</router-link
    >
  </div>
</template>
