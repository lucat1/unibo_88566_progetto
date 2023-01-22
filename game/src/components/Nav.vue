<script lang="ts">
import { defineComponent } from "vue";
import { removeAuthToken } from "shared/auth";
import { GAME_ENDPOINT, FRONTOFFICE_ENDPOINT } from "shared/endpoints";

import { routes } from "../router";
import { useAuth } from "../auth";

export default defineComponent({
  data() {
    const auth = useAuth();
    return {
      auth,
      routes: routes.filter(
        (route) => !/Register|Login|NotFound|Index/.test(route.name || "")
      ),
      opened: false,
    };
  },
  computed: {
    userProfile() {
      return FRONTOFFICE_ENDPOINT + "users/" + this.auth.uuid;
    },
    logo() {
      return GAME_ENDPOINT + "logo.png";
    },
  },
  methods: {
    async logout() {
      removeAuthToken();
      await this.auth.try();
    },
  },
});
</script>

<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <img alt="Animal House Logo" :src="logo" class="mr-4" />
        Animal House Game
      </router-link>

      <a
        role="button"
        class="navbar-burger"
        v-bind:class="{ 'is-active': opened }"
        v-on:click="opened = !opened"
        aria-label="expand menu"
        v-bind:aria-expanded="opened"
        data-target="nav"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="nav"
      aria-label="menu"
      v-bind:aria-expanded="opened"
      class="navbar-menu"
      v-bind:class="{ 'is-active': opened }"
    >
      <div class="navbar-start">
        <router-link
          v-for="route in routes"
          v-bind:to="route.path"
          class="navbar-item"
          >{{ route.name }}</router-link
        >
      </div>

      <div class="navbar-end">
        <a v-if="auth.authenticated" class="navbar-item" :href="userProfile">
          {{ auth.username }}
        </a>
        <div v-if="auth.authenticated" class="navbar-item">
          <div class="buttons">
            <button @click="logout" class="button is-light">Log out</button>
          </div>
        </div>
        <div v-else class="navbar-item">
          <div class="buttons">
            <!-- TODO: are these links accessible? not working with <space> -->
            <router-link to="/register" class="button is-primary">
              <strong>Sign up</strong>
            </router-link>
            <router-link to="/login" class="button is-light"
              >Log in</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
