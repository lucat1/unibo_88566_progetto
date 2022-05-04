<script lang="ts">
import { defineComponent, reactive } from "vue";
export default defineComponent({
  data() {
    return reactive({
      amount: 5,
      current: 0,
      difficultyColors: {
        easy: "is-green",
        medium: "is-orange",
        hard: "is-red",
        _: "is-black",
      },

      isLoading: true,
      error: null,
      data: null,
    });
  },
  async created() {
    this.isLoading = true;
    try {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=${this.amount}&category=27`
      );
      this.data = (await res.json()).results.map((quiz) => ({
        ...quiz,
        answers: [...quiz.incorrect_answers, quiz.correct_answer],
      }));
      this.isLoading = false;
    } catch (e) {
      this.error = e as any;
      this.isLoading = false;
    }
  },
});
</script>

<template>
  <div v-if="isLoading">TODO: handle loading</div>
  <div v-else-if="!isLoading && error != null">
    TODO: handle error in a pretty visual way
  </div>
  <div v-else class="card">
    <div class="card-content">
      <div class="content">
        <h4 class="title is-4">Quiz #{{ current + 1 }}</h4>
        <span
          v-bind:class="
            difficultyColors[data[current].difficulty] || difficultyColors._
          "
          class="tag is-medium"
          >{{ data[current].difficulty }}</span
        >
        <p>
          {{ data[current].querstion }}
        </p>
        <div v-if="data[current].type == 'boolean'">
          <button v-for="answer in data[current].answers" class="button">
            {{ answer }}
          </button>
        </div>
        <div v-else-if="data[current].type == 'multiple'"></div>
        <div v-else>TODO: implement quiz type: {{ data[current].type }}</div>
      </div>
    </div>
    <footer class="card-footer">
      <a href="#" class="card-footer-item">Skip</a>
    </footer>
  </div>
</template>
