<script lang="ts">
import { defineComponent, reactive } from "vue";

const API_BASE_PATH = "https://random.dog/"
const ENDPOINT = "woof?include=mp4,webm"
const REQUEST_URL = API_BASE_PATH + ENDPOINT

interface State {
  url: string;
}

async function getImageUrl() {
  return API_BASE_PATH + await (await fetch(REQUEST_URL)).text()
}

export default defineComponent({
  name: "Memory",
  async setup() {
    return reactive({
      url: await getImageUrl()
    }) as State
  },
  methods: {
    async next() {
      this.url = await getImageUrl()
    }
  },
})
</script>

<template>
  <h1 class="title is-1">Videos</h1>
  <div class="card">
    <div class="card-image">
      <div class="columns is-centered">
          <video :key="this.url" autoplay controls loop class="column is-full" style="max-height: 60vh">
            <source :src="this.url" alt="A cute video of a dog."/>
            Unsupported video tag.
          </video>
      </div>
    </div>
    <footer class="card-footer">
      <a @click="next()" class="card-footer-item">
        <span>
          Next
        </span>
      </a>
    </footer>
  </div>
</template>
