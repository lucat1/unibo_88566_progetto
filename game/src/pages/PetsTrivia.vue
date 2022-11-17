<script lang="ts">
import { defineComponent, reactive } from "vue";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";
import fetch from "shared/fetch";
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
    const { pets } = await fetch<IUser>("auth/me");
    return reactive({
      auth,
      pets,
      selected: 0,
    }) as State;
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
  <h1 class="title is-1">Trivias about pets similar to mine</h1>
  <div>
    <div v-if="pets.length == 0" class="column my-6" style="text-align: center">
      You haven't yet provided any owned pets. <br />
      You can do so in <a :href="userProfile">your profile page</a>
    </div>
    <div class="is-flex is-flex-direction-row" style="overflow-x: auto">
      <div
        v-for="(pet, i) in pets"
        :key="i"
        class="card mx-4 my-3"
        :class="{ selected: selected == i }"
        style="max-width: 24rem; cursor: pointer"
        @click="selected = i"
      >
        <div class="card-content">
          <div class="content">
            {{ pet.name }}
          </div>
        </div>
        <div class="card-content">
          <div class="content">
            {{ pet.type }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <Suspense>
    <PetTriviaTrivias
      v-if="selected <= pets.length - 1"
      :keyword="pets[selected].type"
    />
    <template #fallback>
      <progress class="progress is-primary" />
    </template>
  </Suspense>
</template>
