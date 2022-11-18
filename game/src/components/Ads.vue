<script lang="ts">
import { defineComponent, reactive } from "vue";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";

export default defineComponent({
  setup() {
    return {
      length: 3,
    };
  },
  data() {
    return {
      length: 3,
      products_url: FRONTOFFICE_ENDPOINT + "products",
      services_url: FRONTOFFICE_ENDPOINT + "services",
    };
  },
  methods: {},
});
</script>

<template>
  <div class="block">
    <h1 v-if="length > 0" class="title is-3">Products from you</h1>
    <div class="columns">
      <div v-for="(product, i) in [0, 1, 2, 3, 4]" :key="i" class="column">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="content">Product {{ product }}</div>
          </div>
        </div>
      </div>
    </div>
    <a :href="products_url" class="button is-primary">More</a>
  </div>
  <div class="block">
    <h1 v-if="length > 0" class="title is-3">Services for you</h1>
    <div class="columns">
      <div v-for="(service, i) in [0, 1, 2, 3, 4]" :key="i" class="column">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="content">Service {{ service }}</div>
          </div>
        </div>
      </div>
    </div>
    <a :href="services_url" class="button is-primary">More</a>
  </div>
</template>
