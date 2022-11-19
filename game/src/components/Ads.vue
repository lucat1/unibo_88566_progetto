<script lang="ts">
import { defineComponent } from "vue";
import { API_ENDPOINT, FRONTOFFICE_ENDPOINT } from "shared/endpoints";

const PRODUCTS_ENDPOINT = API_ENDPOINT + "random-products",
  SERVICES_ENDPOINT = API_ENDPOINT + "store/random-services";

export default defineComponent({
  async setup() {
    return {
      products: await (await fetch(PRODUCTS_ENDPOINT)).json(),
      productsLink: FRONTOFFICE_ENDPOINT + "products",
      services: await (await fetch(SERVICES_ENDPOINT)).json(),
      servicesLink: FRONTOFFICE_ENDPOINT + "services",
    };
  },
});
</script>

<template>
  <div class="block">
    <h1 v-if="products.length > 0" class="title is-3">Products from you</h1>
    <div class="columns">
      <div v-for="(product, i) in products" :key="i" class="column">
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
            <div class="content">{{ product.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <a :href="productsLink" class="button is-primary">More</a>
  </div>
  <div class="block">
    <h1 v-if="services.length > 0" class="title is-3">Services for you</h1>
    <div class="columns">
      <div v-for="(service, i) in services" :key="i" class="column">
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
            <div class="content">{{ service.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <a :href="servicesLink" class="button is-primary">More</a>
  </div>
</template>
