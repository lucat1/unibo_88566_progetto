<script lang="ts">
import { defineComponent, reactive } from "vue";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";
import fetch from "shared/fetch";
import { getPets } from "shared/pets";
import type { IUser, IUserPet } from "shared/models/user";

import PetTriviaTrivias from "../components/PetTriviaTrivias.vue";
import { useAuth } from "../auth";

export default defineComponent({
  name: "PetsTrivia",
  components: {
    PetTriviaTrivias,
  },
  async setup() {
    const auth = useAuth();
    let pets: IUserPet[];
    if (auth.authenticated) pets = (await fetch<IUser>("auth/me")).pets;
    else pets = getPets();

    return reactive({
      auth,
      pets,
      selected: 0 as number,
    });
  },
  computed: {
    userProfile() {
      return FRONTOFFICE_ENDPOINT + "users/" + this.auth.uuid;
    },
  },
});
</script>

<style>
.selected {
  border: 2px solid hsl(171deg, 100%, 41%);
}
</style>

<template>
  <h1 class="title is-1">Animals whose names are similar to my pets'</h1>
  <div>
    <div v-if="pets.length == 0" class="column my-6" style="text-align: center">
      You haven't yet provided any owned pets. <br />
      You can do so in
      <a v-if="auth.authenticated" :href="userProfile">your profile page</a>
      <router-link v-if="!auth.authenticated" to="/pets"
        >your pets page</router-link
      >
    </div>
    <div v-else class="column my-6">
      <div class="block">
        <label html-for="petSelect">Select one of your pets: </label>
      </div>
      <select id="petSelect" class="button is-active">
        <option
          v-for="(pet, i) in pets"
          :key="i"
          class="dropdown-item"
          @click="selected = i"
        >
          {{ pet.name }} ({{ pet.type }})
        </option>
      </select>
    </div>
  </div>

  <Suspense>
    <PetTriviaTrivias
      v-if="selected <= pets.length - 1"
      :keyword="pets[selected].type"
    />
    <template #fallback>
      <progress class="progress is-link" />
    </template>
  </Suspense>
</template>
