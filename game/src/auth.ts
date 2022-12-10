import { defineStore } from "pinia";

import type { IUser } from "shared/models/user";
import fetch from "shared/fetch";
import { isAuthenticated, getUUID, setUUID, hasUUID } from "shared/auth";

const ANONYMOUS = "anonymous";

export enum AuthKind {
  USER,
  UUID,
  NONE,
}

export interface State {
  kind: AuthKind;
  user: IUser | string | null;
}

export const useAuth = defineStore("user", {
  state: (): State => ({
    kind: AuthKind.NONE,
    user: null,
  }),
  getters: {
    authenticated(state) {
      return state.kind == AuthKind.USER;
    },
    username(state) {
      return state.kind == AuthKind.USER
        ? (state.user as IUser).username
        : ANONYMOUS;
    },
    uuid(state) {
      switch (state.kind) {
        case AuthKind.USER:
          return (state.user as IUser)._id!;
        case AuthKind.UUID:
          return state.user as string;
        case AuthKind.NONE:
          return undefined;
      }
    },
  },
  actions: {
    async try() {
      if (isAuthenticated()) {
        try {
          this.authenticateAsUser(await fetch<IUser>("auth/me"));
        } catch (_) {
          this.tryUUID();
        }
      } else {
        this.tryUUID();
      }
    },
    async tryUUID() {
      let uuid: string;
      if (hasUUID()) uuid = getUUID();
      else {
        uuid = (await fetch<{ id: string }>("auth/id")).id;
        setUUID(uuid);
      }
      this.authenticateAsUUID(uuid);
    },
    authenticateAsUser(user: IUser) {
      if (!user) throw new Error("Invalid user");

      this.kind = AuthKind.USER;
      this.user = user;
    },
    authenticateAsUUID(uuid: string) {
      this.kind = AuthKind.UUID;
      this.user = uuid;
    },
  },
});
