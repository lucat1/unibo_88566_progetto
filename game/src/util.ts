import fetch, { withOptions } from "shared/fetch";
import { getUUID } from "shared/auth";

import router from "./router";
import { useAuth } from "./auth";

export const setScore = async (game: string, score: number) => {
  await fetch(
    useAuth().authenticated
      ? `game/score/${game}`
      : `game/score/${game}?id=${getUUID()}`,
    withOptions("PATCH", { score })
  );
  router.push(`/leaderboard/${game}?score=${score}`);
};
