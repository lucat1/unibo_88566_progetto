<script lang="ts">
import { defineComponent } from "vue";
import internalFetch, { withOptions } from "shared/fetch";
import type { IGameScore } from "shared/models/game-score";
import { useAuth, getUUID } from "./auth";
import router from "./router";

interface TrueOrFalse {
  question: string;
  answer: boolean;
  image: string;
}

const N_OF_QUESTIONS = 5

export default defineComponent({
  async setup() {
    const auth = useAuth();
    const res = await fetch(
      `https://zoo-animal-api.herokuapp.com/animals/rand/${2 * N_OF_QUESTIONS}`
    );
    const animals = await res.json()
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

    return {
      auth,
      questions,
      current: 0,
      result: 0,
    };
  },
  methods: {
    async answer(myAnswer: boolean) {
      if (myAnswer == this.questions[this.current].answer) ++this.result;
      if (++this.current == N_OF_QUESTIONS) {
        await internalFetch<IGameScore>(
          this.auth.authenticated
            ? "game/score/quiz"
            : `game/score/quiz?id=${getUUID()}`,
          withOptions("PATCH", { score: this.result })
        );
        router.push(`/leaderboard/quiz?score=${this.result}`);
      }
    },
  },
});
</script>

<template>
  <div v-if="current < questions.length" class="card">
    <div class="card-image">
      <figure class="image is-16by9">
        <img
          v-bind:src="questions[current].image"
          alt="Subject of the question"
          style="aspect-ratio: 1 / 1; object-fit: cover"
        />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <h4 class="title is-4">Question {{ current + 1 }} / {{ questions.length }}</h4>
        <p>
          {{ questions[current].question }}
        </p>
      </div>
      <progress
        class="progress is-primary"
        v-bind:value="current"
        v-bind:max="questions.length"
      ></progress>
    </div>
    <footer class="card-footer">
      <a href="#" @click="answer(true)" class="card-footer-item">True</a>
      <a href="#" @click="answer(false)" class="card-footer-item">False</a>
    </footer>
  </div>
</template>
