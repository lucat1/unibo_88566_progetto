<script lang="ts">
import { defineComponent, reactive } from "vue";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";
import fetch from "shared/fetch";
import { animalTypes, getPets, setPets } from "shared/pets";
import type { IUser, IUserPet } from "shared/models/user";

import { useAuth } from "../auth";

export default defineComponent({
  name: "Pets",
  async setup() {
    const auth = useAuth();
    let pets: IUserPet[];
    if (auth.authenticated) pets = (await fetch<IUser>("auth/me")).pets;
    else pets = getPets();

    return reactive({
      auth,
      pets,
      animalTypes,
    });
  },
  computed: {
    userProfile() {
      return FRONTOFFICE_ENDPOINT + "users/" + this.auth.uuid;
    },
  },
  methods: {
    remove(i: number) {
      this.pets = this.pets.filter((_: unknown, j) => j != i);
      setPets(this.pets);
    },
    add(pet: IUser) {
      this.pets = [...getPets(), pet];
      setPets(this.pets);
    },
  },
});
</script>

<template>
  <h1 class="title is-1">Your pets</h1>
  <div v-if="pets.length == 0" class="column my-6" style="text-align: center">
    You haven't yet provided any owned pets.
    <template v-if="auth.authenticated">
      You can do so on <a :href="userProfile">your profile page</a>.
    </template>
  </div>
  <div
    v-if="pets.length != 0 && auth.authenticated"
    class="column my-6"
    style="text-align: center"
  >
    You can more pets on <a :href="userProfile">your profile page</a>.
  </div>
  <div class="is-flex is-flex-direction-column">
    <div
      v-for="(pet, i) in pets"
      :key="i"
      class="is-flex is-flex-direction-row is-justify-content-space-between"
    >
      <h4 className="subtitle is-6">{{ pet.name }}</h4>
      <span className="subtitle is-6">{{ pet.type }}</span>
      <span className="subtitle is-6">
        {{ pet.sex }} - {{ pet.age }} years old
      </span>
      <button
        className="delete"
        aria-label="Remove pet"
        @click="remove(i)"
      ></button>
    </div>
  </div>
  <FormKit
    type="form"
    @submit="add"
    :disabled="auth.authenticated"
    :actions="false"
  >
    <h2 class="title is-size-4">Add a new pet</h2>
    <FormKit
      type="text"
      name="name"
      label="Name"
      validation="required"
      validation-visibility="live"
      outer-class="field"
      label-class="label"
      inner-class="control"
      input-class="input"
      help-class="help"
      message-class="help is-danger"
    />
    <FormKit
      type="select"
      name="type"
      label="Animal type"
      validation="required"
      validation-visibility="live"
      outer-class="field"
      label-class="label"
      inner-class="control"
      input-class="input"
      help-class="help"
      message-class="help is-danger"
      :options="animalTypes"
    />
    <FormKit
      type="select"
      name="sex"
      label="Animal sex"
      validation="required"
      validation-visibility="live"
      outer-class="field"
      label-class="label"
      inner-class="control"
      input-class="input"
      help-class="help"
      message-class="help is-danger"
      :options="['not given', 'male', 'female']"
    />
    <FormKit
      type="number"
      name="age"
      label="Animal age (in years)"
      validation="required"
      validation-visibility="live"
      outer-class="field"
      label-class="label"
      inner-class="control"
      input-class="input"
      help-class="help"
      message-class="help is-danger"
    />
    <div class="field">
      <div class="control">
        <button :disabled="auth.authenticated" class="button is-link">
          Add
        </button>
      </div>
    </div>
  </FormKit>
</template>
