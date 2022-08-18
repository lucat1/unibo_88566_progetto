<script lang="ts">
import { defineComponent } from "vue";
import { removeAuthToken } from 'shared/auth'
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";

import { routes } from "./router";
import { useAuth, removeUUID } from './auth'

export default defineComponent({
  data() {
    const auth = useAuth()
    return {
      auth,
      routes: routes.filter(
        (route) => !/Register|Login|NotFound|Index/.test(route.name || "")
      ),
      opened: false,
    };
  },
  computed: {
      userProfile(){ return FRONTOFFICE_ENDPOINT + '/users/' + this.auth.uuid },
  },
  methods: {
    async logout() {
      removeAuthToken();
      await this.auth.try();
    }
  }
});
</script>

<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <img alt="Animal House Logo" src="logo.png" width="112" height="28" />
        Animal House Game
      </router-link>

      <a role="button" class="navbar-burger" v-bind:class="{ 'is-active': opened }" v-on:click="opened = !opened"
        aria-label="menu" aria-expanded="false" data-target="nav">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="nav" class="navbar-menu" v-bind:class="{ 'is-active': opened }">
      <div class="navbar-start">
        <!-- TODO: are these links accessible? not working with <space> -->
        <router-link v-for="route in routes" v-bind:to="route.path" class="navbar-item">{{ route.name }}</router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div v-if="auth.authenticated">
        <a :href="userProfile">{{auth.username}}</a>
            <button @click="logout" class="button is-light">Log out</button>
      </div>
          <div v-else class="buttons">
            <!-- TODO: are these links accessible? not working with <space> -->
            <router-link to="/register" class="button is-primary">
              <strong>Sign up</strong>
            </router-link>
            <router-link to="/login" class="button is-light">Log in</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
