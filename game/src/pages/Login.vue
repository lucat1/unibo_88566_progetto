<script lang="ts">
import { defineComponent, reactive } from "vue";
import { setAuthToken } from "shared/auth";
import fetch, { withOptions } from "shared/fetch";
import type { Error } from "shared/fetch";

import router from "../router";
import { useAuth } from "../auth";

export default defineComponent({
  async setup() {
    const auth = useAuth();
    if (auth.authenticated) router.push("/");
    return reactive({
      auth,
      loading: false,
      error: "",
    });
  },
  methods: {
    async login({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) {
      this.loading = true;
      this.error = "";
      try {
        const { token } = await fetch<{ token: string }>(
          "auth/login",
          withOptions("POST", { username, password })
        );
        setAuthToken(token);
        await this.auth.try();
        router.push("/");
      } catch (err) {
        this.error =
          (err as Error<never>).message ||
          "Invalid username/password combination";
      }
      this.loading = false;
    },
  },
});
</script>
<template>
  <div class="center h-full">
    <FormKit
      type="form"
      form-class="box"
      @submit="login"
      :actions="false"
      :errors="[error]"
      :disabled="loading"
    >
      <h1 class="title">Login</h1>
      <FormKit
        type="text"
        name="username"
        label="Username"
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
        type="password"
        name="password"
        label="Password"
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
          <button class="button is-link" :disabeld="loading">Login</button>
        </div>
      </div>
    </FormKit>
  </div>
</template>
