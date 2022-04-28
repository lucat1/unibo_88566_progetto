<script lang="ts">
import { defineComponent } from "vue";
import { routes } from "./router";

export default defineComponent({
  data() {
    return {
      routes: routes.filter(
        (route) => !/Register|Login|NotFound/.test(route.name || "")
      ),
      opened: false,
    };
  },
});
</script>

<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io">
        <img alt="" src="logo" width="112" height="28" />
      </a>

      <a role="button" class="navbar-burger" v-bind:class="{ 'is-active': opened }" v-on:click="opened = !opened"
        aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu" v-bind:class="{ 'is-active': opened }">
      <div class="navbar-start">
        <!-- TODO: are these links accessible? not working with <space> -->
        <router-link v-for="route in routes" v-bind:to="route.path" class="navbar-item">{{ route.name }}</router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
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
