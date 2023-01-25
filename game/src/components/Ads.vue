<script lang="ts">
import { defineComponent } from "vue";
import { API_ENDPOINT, FRONTOFFICE_ENDPOINT } from "shared/endpoints";

const PRODUCTS_ENDPOINT = API_ENDPOINT + "store/random-products",
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
  <div v-if="products.length > 0" class="block">
    <h2 class="title is-2">Products for you</h2>
    <div class="columns">
      <div
        v-for="(product, i) in products"
        :key="i"
        class="column is-one-fifth"
      >
        <a :href="productsLink + '/' + product._id" target="_blank">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img
                  v-if="product.photos.length > 0"
                  :src="product.photos[0]"
                  :alt="product.name"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="content">{{ product.name }}</div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <a :href="productsLink" class="button is-link">More products</a>
  </div>
  <div v-if="services.length > 0" class="block">
    <h2 class="title is-2">Services for you</h2>
    <div class="columns">
      <div
        v-for="(service, i) in services"
        :key="i"
        class="column is-one-fifth"
      >
        <a :href="servicesLink + '/' + service._id" target="_blank">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img
                  v-if="service.photos.length > 0"
                  :src="service.photos[0]"
                  :alt="service.name"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="content">{{ service.name }}</div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <a :href="servicesLink" class="button is-link">More services</a>
  </div>
</template>
