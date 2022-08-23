<script lang="ts">
import { defineComponent } from "vue";

import { GameType } from "shared/models/game-score";
import Leaderboard from "../components/Leaderboard.vue";

export default defineComponent({
  data() {
    return {
      pages: Object.values(GameType),
      current: this.$route.params.game,
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
  <div v-if="score" class="notification is-primary">Result: {{ score }}</div>
  <div class="tabs">
    <ul>
      <li v-for="page in pages" :class="page == current && 'is-active'">
        <router-link :to="'/leaderboard/' + page">{{
            page.charAt(0).toUpperCase() + page.slice(1)
        }}</router-link>
      </li>
    </ul>
  </div>
  <Leaderboard :game="current" :limit="5" />
  <router-link v-if="score != undefined" :to="'/' + current" class="button is-primary">Retry</router-link>
</template>
