import { createWebHistory, createRouter } from "vue-router";
import { GAME_ENDPOINT } from "shared/endpoints";

import Index from "./pages/Index.vue";
import NotFound from "./pages/NotFound.vue";
import Register from "./pages/Register.vue";
import Login from "./pages/Login.vue";
import Videos from "./pages/Videos.vue";
import Help from "./pages/Help.vue";
import Quiz from "./pages/Quiz.vue";
import Memory from "./pages/Memory.vue";
import Hangman from "./pages/Hangman.vue";
import Leaderboard from "./pages/Leaderboard.vue";

export const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/videos",
    name: "Videos",
    component: Videos,
  },
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
  {
    path: "/quiz",
    name: "Quiz",
    component: Quiz,
  },
  {
    path: "/memory",
    name: "Memory",
    component: Memory,
  },
  {
    path: "/hangman",
    name: "Hangman",
    component: Hangman,
  },
  {
    path: "/leaderboard/:game",
    name: "Leaderboard",
    component: Leaderboard,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(
    GAME_ENDPOINT.includes("unibo.it") ? "/game/" : "/"
  ),
  routes,
  linkActiveClass: "is-active",
});

export default router;
