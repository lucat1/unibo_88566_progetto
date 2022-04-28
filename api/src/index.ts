import polka from "polka";
// @ts-ignore
import send from "@polka/send-type";
import sirv from "sirv";
import { json } from "body-parser";
import cors from "cors";
import { connect } from "mongoose";

import { join } from "path";
import { readFile } from "fs/promises";
import { API_PORT, API_ENDPOINT, MONGO_URL } from "../../endpoints.json";
import {
  register as registerWrapper,
  login as loginWrapper,
  authMiddleware,
  authRequired,
  authNotRequired,
  LoginData,
  RegisterData,
} from "./auth";
import {
  catcher,
  validateBody,
  validateParams,
  validateQuery,
} from "./validate";
import { register, login, me, id } from "./handlers/auth";
import {
  GameBody,
  GameParams,
  GameQuery,
  setScore,
  getScore,
} from "./handlers/game";

const sites = ["game", "frontoffice", "backoffice"],
  app = polka();

const main = async () => {
  /* Serve all front sites in production */
  console.info("Fetching index files");
  if (API_ENDPOINT.includes("unibo.it")) {
    for (const site of sites) {
      const index = await readFile(
        join(__dirname, "..", "..", site, "build", "index.html")
      );
      app
        .use(`/${site}`, sirv(join(__dirname, "..", "..", site, "build")))
        .get(`/${site}/*`, (_, res) =>
          send(res, 200, index, {
            "Content-Type": "text/html",
          })
        );
    }
  }
  console.info(`Connecting to mongo as ${MONGO_URL}`);
  await connect(MONGO_URL);

  app.use("/api", cors());
  app.use("/api", json());
  app.use("/api", authMiddleware);

  app.post(
    "/api/auth/register",
    authNotRequired,
    validateBody(RegisterData),
    registerWrapper(register)
  );
  app.post(
    "/api/auth/login",
    authNotRequired,
    validateBody(LoginData),
    loginWrapper(login)
  );

  app.get("/api/auth/id", authNotRequired, id);
  app.get("/api/auth/me", authRequired, catcher(me));

  app.post(
    "/api/game/:game",
    validateParams(GameParams),
    validateQuery(GameQuery),
    validateBody(GameBody),
    catcher(setScore as any)
  );
  app.get(
    "/api/game/:game",
    validateParams(GameParams),
    validateQuery(GameQuery),
    catcher(getScore as any)
  );

  app.listen(API_PORT, () => console.info(`Listening on :${API_PORT}`));
};

main();
