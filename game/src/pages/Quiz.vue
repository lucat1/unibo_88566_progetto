<script lang="ts">
import { defineComponent } from "vue";
import internalFetch, { withOptions } from "shared/fetch";
import { setScore } from "../util";

interface TrueOrFalse {
  question: string;
  answer: boolean;
}

const N_OF_QUESTIONS = 5;

export default defineComponent({
  async setup() {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${N_OF_QUESTIONS}&category=27&type=boolean&encode=url3986`
    );
    const data = await res.json();
    return {
      questions: data.results.map((result) => ({
        question: decodeURI(result.question),
        answer: result.correct_answer == "True",
      })),
      current: 0,
      result: 0,
    };
  },
  methods: {
    async answer(myAnswer: boolean) {
      if (myAnswer == this.questions[this.current].answer) ++this.result;
      if (++this.current == N_OF_QUESTIONS) {
        await setScore("quiz", this.result);
      }
    },
  },
});
</script>

<template>
  <div class="is-flex is-align-items-center is-justify-content-center">
    <div
      v-if="current < questions.length"
      class="card"
      role="region"
      aria-live="polite"
    >
      <!-- <div class="card-image"> -->
      <!--   <figure class="image" style="max-height: 60vh"> -->
      <!--     <img -->
      <!--       v-bind:src="questions[current].image" -->
      <!--       alt="Subject of the question" -->
      <!--       style="aspect-ratio: 1 / 1; object-fit: cover; max-height: 60vh" -->
      <!--     /> -->
      <!--   </figure> -->
      <!-- </div> -->
      <div class="card-content">
        <div class="content">
          <h4 class="title is-4">
            Question {{ current + 1 }} / {{ questions.length }}
          </h4>
          <p id="question">
            {{ questions[current].question }}
          </p>
        </div>
        <progress
          class="progress is-link"
          v-bind:value="current"
          v-bind:max="questions.length"
        ></progress>
      </div>
      <footer class="card-footer" role="radiogroup" aria-labelledby="question">
        <a href="#" role="radio" @click="answer(true)" class="card-footer-item"
          >True</a
        >
        <a href="#" role="radio" @click="answer(false)" class="card-footer-item"
          >False</a
        >
      </footer>
    </div>
  </div>
</template>
