import { defineStore } from "pinia";

import type { IUser } from "shared/models/user";
import fetch from "shared/fetch";
import { isAuthenticated } from "shared/auth";

const ANONYMOUS = 'anonymous', UUIDKEY = 'authuuid'

enum AuthKind {
  USER,
  UUID,
  NONE,
}

interface State {
  kind: AuthKind;
  user: IUser | string | undefined;
}

export const useAuth = defineStore("user", {
  state: (): State => ({
    kind: AuthKind.NONE,
    user: undefined,
  }),
  getters: {
    authenticated(state) {
      return state.kind == AuthKind.USER;
    },
    username(state) {
      return state.kind == AuthKind.USER ? (state.user as IUser).username : ANONYMOUS;
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
      if(isAuthenticated()) {
        try {
          this.authenticateAsUser(await fetch<IUser>("auth/me"))
        } catch(_) {
        }
      } else {
        this.tryUUID();
      }},
    async tryUUID() {
      let uuid: string;
      if(hasUUID()) 
        uuid = getUUID();
      else {
        uuid = (await fetch<{id: string}>("auth/id")).id;
        localStorage.setItem(UUIDKEY, uuid);
      }
      this.authenticateAsUUID(uuid);
    },
    authenticateAsUser(user: IUser) {
      this.kind = AuthKind.USER;
      this.user = user;
    },
    authenticateAsUUID(uuid: string) {
      this.kind = AuthKind.UUID;
      this.user = uuid
    }
  }
});

export const hasUUID = () => {
  return localStorage.getItem(UUIDKEY) != null;
}

export const getUUID = (): string => {
  return localStorage.getItem(UUIDKEY)!;
}

export const removeUUID = () => {
  return localStorage.removeItem(UUIDKEY);
}
