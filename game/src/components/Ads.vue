<script lang="ts">
import { defineComponent } from "vue";
import { removeAuthToken } from "shared/auth";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";

import { routes } from "../router";
import { useAuth } from "../auth";

export default defineComponent({
  data() {
    const auth = useAuth();
    return {
      auth,
      routes: routes.filter(
        (route) =>
          !/Register|Login|NotFound|Index|Leaderboard/.test(route.name || "")
      ),
      opened: false,
    };
  },
  computed: {
    userProfile() {
      return FRONTOFFICE_ENDPOINT + "users/" + this.auth.uuid;
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
  <h1 class="title is-3">Suggestions for you</h1>
</template>
