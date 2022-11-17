<script lang="ts">
import { defineComponent, reactive } from "vue";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";
import fetch from 'shared/fetch'
import type { IUser, IUserPet } from 'shared/models/user'

const REQUEST_URL = "https://api.api-ninjas.com/v1/animals?name="

export interface Taxonomy {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    scientific_name: string;
}

export interface Characteristics {
    prey: string;
    name_of_young: string;
    group_behavior: string;
    estimated_population_size: string;
    biggest_threat: string;
    most_distinctive_feature: string;
    other_name(s): string;
    gestation_period: string;
    habitat: string;
    predators: string;
    diet: string;
    average_litter_size: string;
    lifestyle: string;
    common_name: string;
    number_of_species: string;
    location: string;
    slogan: string;
    group: string;
    color: string;
    skin_type: string;
    top_speed: string;
    lifespan: string;
    weight: string;
    length: string;
    age_of_sexual_maturity: string;
    age_of_weaning: string;
    distinctive_feature: string;
    temperament: string;
    training: string;
    type: string;
    litter_size: string;
    height: string;
    origin: string;
    main_prey: string;
    favorite_food: string;
    water_type: string;
    optimum_ph_level: string;
    average_clutch_size: string;
}

export interface Info {
    name: string;
    taxonomy: Taxonomy;
    locations: string[];
    characteristics: Characteristics;
}

const getTrivias = async (keyword: string): Info[] => {
    const req = await window.fetch(REQUEST_URL + keyword, {
      headers: {
        'X-Api-Key': 'fpMts/bK6/459XcehSHcDg==7xby2scRy4rCzjt5'
      }
    });
    return await req.json() as Info[];
}

export default defineComponent({
  name: "PetsTrivia",
  props: {
    keyword: String
  },
  async setup({ keyword }) {
    return reactive({
      trivias: await getTrivias(keyword),
      selected: 0
    });
  },
  methods: {
    prev() {
      if(this.selected > 0)
      this.selected--
    },
    next() {
      if(this.selected < this.trivias.length - 1)
        this.selected++
    },
  },
  watch: {
    async keyword(val) {
      this.trivias = await getTrivias(val);
      this.selected = 0;
    }
  },
  computed: {
    userProfile() {
      return FRONTOFFICE_ENDPOINT + "users/" + this.auth.uuid;
    },
    async trivias() {
      if(this.pets.length-1 > this.selected)
        return

    }
  },
});
</script>

<style>
.disabled {
  color: grey;
}
</style>

<template>
  <div v-if="trivias.length <= 0" class="is-flex" style="text-align: center">
    No trivias were found for the animal type <span style="font-weight: bold">{{ keyword }}</span>
  </div>
  <div v-if="trivias.length > 0" class="card my-6">
    <div class="card-content">
      <div class="content">
        <h3 class="title is-3">{{trivias[selected].name}}</h3>
        <h4 class="subtitle is-5">{{trivias[selected].locations.join(' ')}}</h4>
        <h5 class="subtitle is-6">Taxonomy</h5>
        <ul>
          <li v-if="trivias[selected].taxonomy.kingdom">Kingdom: {{trivias[selected].taxonomy.kingdom}}</li>
          <li v-if="trivias[selected].taxonomy.phylum">Phylum: {{trivias[selected].taxonomy.phylum}}</li>
          <li v-if="trivias[selected].taxonomy.class">Class: {{trivias[selected].taxonomy.class}}</li>
          <li v-if="trivias[selected].taxonomy.order">Order: {{trivias[selected].taxonomy.order}}</li>
          <li v-if="trivias[selected].taxonomy.family">Family: {{trivias[selected].taxonomy.family}}</li>
          <li v-if="trivias[selected].taxonomy.genus">Genus: {{trivias[selected].taxonomy.genus}}</li>
          <li v-if="trivias[selected].taxonomy.scientific_name">Scientific Name: {{trivias[selected].taxonomy.scientific_name}}</li>
        </ul>
        <!-- TODO: more data inside trivias[selected].characteristics -->
        <!-- {{trivias[selected]}} -->
      </div>
    </div>
    <footer class="card-footer">
      <a @click="prev()" class="card-footer-item" :class="{ disabled: selected <= 0 }">
        Previous
      </a>
      <a @click="next()" class="card-footer-item" :class="{ disabled: selected >= trivias.length }">
        Next
      </a>
    </footer>
  </div>
</template>
