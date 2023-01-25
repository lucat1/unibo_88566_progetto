<script lang="ts">
import { defineComponent, reactive } from "vue";
import { setAuthToken, removeUUID, getUUID } from "shared/auth";
import { getPets, removePets } from "shared/pets";
import fetch, { withOptions } from "shared/fetch";
import type { Error } from "shared/fetch";
import type { IUser } from "shared/models/user";

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
    async register({
      username,
      firstName,
      lastName,
      password,
    }: IUser & { password: string }) {
      this.loading = true;
      this.error = "";
      try {
        const { token } = await fetch<{ token: string }>(
          "auth/register",
          withOptions("POST", {
            username,
            password,
            firstName,
            lastName,
            fromuuid: getUUID(),
            frompets: getPets(),
          })
        );
        setAuthToken(token);
        removeUUID();
        removePets();
        await this.auth.try();
        router.push("/");
      } catch (err) {
        this.error =
          (err as Error<never>).message || "Invalid username or password";
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
      @submit="register"
      :actions="false"
      :errors="[error]"
      :disabled="loading"
    >
      <h1 class="title">Sign up</h1>
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
        type="text"
        name="firstName"
        label="First name"
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
        type="text"
        name="lastName"
        label="Last name"
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
      <FormKit
        type="password"
        name="password_confirm"
        label="Confirm password"
        validation="required|confirm"
        validation-visibility="live"
        help="Repeat your password"
        outer-class="field"
        label-class="label"
        inner-class="control"
        input-class="input"
        help-class="help"
        message-class="help is-danger"
      />
      <div class="field">
        <div class="control">
          <button class="button is-link" :disabeld="loading">Sign up</button>
        </div>
      </div>
    </FormKit>
  </div>
</template>
