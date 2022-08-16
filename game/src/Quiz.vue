<script lang="ts">
import { defineComponent, reactive } from "vue";
import fetch from "shared/fetch";

interface TrueOrFalse {
  question: string;
  answer: boolean;
  image: string;
}

export default defineComponent({
  data() {
    return reactive({
      amount: 5,
      highscore: 0,
      current: 0,
      isLoading: true,
      error: null,
      data: Array<TrueOrFalse>(),
      result: 0,
    });
  },
  async created() {
    this.isLoading = true;
    try {
      const res = await fetch(
        `https://zoo-animal-api.herokuapp.com/animals/rand/${2 * this.amount}`
      );
      function animalsToQuestions(animals: any): Array<TrueOrFalse> {
        let n = animals.length / 2,
          questions = new Array<TrueOrFalse>(n);
        for (let i = 0; i < n; ++i) {
          const attributesToQuestions = [
            ["latin_name", "latin name is"],
            ["animal_type", "class is"],
            ["active_time", "activity behavior is"],
            ["length_min", "minimum length in feet is"],
            ["length_max", "maximum length in feet is"],
            ["weight_min", "minimum weight in pounds is"],
            ["weight_max", "maximum weight in pounds is"],
            ["lifespan", "average lifespan in years is"],
            ["habitat", "habitat is/are the"],
            ["diet", "diet is"],
            ["geo_range", "can be found in"],
          ];
          let randomBoolean = Math.random() >= 0.5,
            randomAttribute =
              attributesToQuestions[
                Math.floor(Math.random() * attributesToQuestions.length)
              ],
            subject = animals[2 * i],
            distractor = animals[2 * i + 1];
          questions[i] = {
            question: `The ${subject.name}'s ${randomAttribute[1]} ${
              (randomBoolean ? subject : distractor)[randomAttribute[0]]
            }.`,
            answer:
              randomBoolean ||
              subject[randomAttribute[0]] === distractor[randomAttribute[0]],
            image: subject.image_link,
          };
        }
        return questions;
      }
      this.data = animalsToQuestions(await res.json());
      this.highscore = (await fetch("game/score/quiz")).score;
      this.isLoading = false;
    } catch (e: any) {
      this.error = e;
      this.isLoading = false;
    }
  },
  methods: {
    answer(myAnswer: boolean) {
      if (myAnswer == this.data[this.current].answer) ++this.result;
      ++this.current;
    },
  },
});
</script>

<template>
  <div v-if="isLoading">
    <progress class="progress is-primary is-widescreen" max="100">15%</progress>
  </div>
  <div v-else-if="!isLoading && error != null">
    <div class="notification is-danger is-light">
      {{ error }}
    </div>
  </div>
  <div v-else-if="current >= amount">
    <div class="notification is-primary">Result: {{ result }}</div>
  </div>
  <div v-else class="card">
    <div class="card-image">
      <figure class="image is-1by1">
        <img
          v-bind:src="data[current].image"
          alt="Subject of the question"
          style="aspect-ratio: 1 / 1; object-fit: cover"
        />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <p>
          {{ highscore }}
        </p>
        <h4 class="title is-4">Question {{ current + 1 }} / {{ amount }}</h4>
        <p>
          {{ data[current].question }}
        </p>
      </div>
      <progress
        class="progress is-primary"
        v-bind:value="current"
        v-bind:max="amount"
      ></progress>
    </div>
    <footer class="card-footer">
      <a href="#" @click="answer(true)" class="card-footer-item">True</a>
      <a href="#" @click="answer(false)" class="card-footer-item">False</a>
    </footer>
  </div>
</template>
