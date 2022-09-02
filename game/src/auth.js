import { defineStore } from "pinia";
import fetch from "shared/fetch";
import { isAuthenticated } from "shared/auth";
import "./router";
const ANONYMOUS = "anonymous", UUIDKEY = "authuuid";
var AuthKind;
(function (AuthKind) {
    AuthKind[AuthKind["USER"] = 0] = "USER";
    AuthKind[AuthKind["UUID"] = 1] = "UUID";
    AuthKind[AuthKind["NONE"] = 2] = "NONE";
})(AuthKind || (AuthKind = {}));
export const useAuth = defineStore("user", {
    state: () => ({
        kind: AuthKind.NONE,
        user: undefined,
    }),
    getters: {
        authenticated(state) {
            return state.kind == AuthKind.USER;
        },
        username(state) {
            return state.kind == AuthKind.USER
                ? state.user.username
                : ANONYMOUS;
        },
        uuid(state) {
            switch (state.kind) {
                case AuthKind.USER:
                    return state.user._id;
                case AuthKind.UUID:
                    return state.user;
                case AuthKind.NONE:
                    return undefined;
            }
        },
    },
    actions: {
        async try() {
            if (isAuthenticated()) {
                try {
                    this.authenticateAsUser(await fetch("auth/me"));
                }
                catch (_) { }
            }
            else {
                this.tryUUID();
            }
        },
        async tryUUID() {
            let uuid;
            if (hasUUID())
                uuid = getUUID();
            else {
                uuid = (await fetch("auth/id")).id;
                localStorage.setItem(UUIDKEY, uuid);
            }
            this.authenticateAsUUID(uuid);
        },
        authenticateAsUser(user) {
            this.kind = AuthKind.USER;
            this.user = user;
        },
        authenticateAsUUID(uuid) {
            this.kind = AuthKind.UUID;
            this.user = uuid;
        },
    },
});
export const hasUUID = () => {
    return localStorage.getItem(UUIDKEY) != null;
};
export const getUUID = () => {
    return localStorage.getItem(UUIDKEY);
};
export const removeUUID = () => {
    return localStorage.removeItem(UUIDKEY);
};
