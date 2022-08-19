import { createWebHistory, createRouter } from "vue-router";

import Index from "./Index.vue";
import NotFound from "./NotFound.vue";
import Register from "./Register.vue";
import Login from "./Login.vue";
import Quiz from "./Quiz.vue";
import Memory from "./Memory.vue";
import Leaderboard from './Leaderboard'

export const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
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
    path: "/leaderboard/:game",
    name: "Leaderboard",
    component: Leaderboard,
  },
  /* TODO: add more games */
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
  history: createWebHistory(),
  routes,
  linkActiveClass: "is-active",
});

export default router;
