<script lang="ts">
import { defineComponent, reactive } from "vue";

const TRIVIAS_PER_PAGE = 3;
const API_BASE_PATH = "https://meowfacts.herokuapp.com/";
const ENDPOINT = "?count=" + TRIVIAS_PER_PAGE;
const REQUEST_URL = API_BASE_PATH + ENDPOINT;

interface State {
  trivias: string[];
}

async function getTrivias() {
  return (await (await fetch(REQUEST_URL)).json())["data"];
}

export default defineComponent({
  name: "Trivia",
  async setup() {
    return reactive({
      trivias: await getTrivias(),
    }) as State;
  },
  methods: {
    async next() {
      this.trivias = await getTrivias();
    },
  },
});
</script>

<template>
  <h1 class="title is-1">Smart Cat Trivias</h1>
  <div class="card">
    <div class="card-image">
      <div class="columns is-centered">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <div class="block" v-for="trivia in trivias">
                {{trivia}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <a @click="next()" class="card-footer-item">
        <span>More trivias</span>
      </a>
    </footer>
  </div>
</template>
