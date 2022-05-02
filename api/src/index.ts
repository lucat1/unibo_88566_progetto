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
import { UserLevel } from "./models/user";
import {
  register as registerWrapper,
  login as loginWrapper,
  authMiddleware,
  authRequired,
  authNotRequired,
  LoginData,
  RegisterData,
  priviledged,
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
  GameScoreQuery,
  setScore,
  getScore,
  getLeaderboard,
} from "./handlers/game";
import { PaginationQuery, SortingQuery } from "./handlers/pagination";
import {
  addCategory,
  CategoryBody,
  CategoryParams,
  getCategories,
  getCategory,
  setCategory,
} from "./handlers/category";
import { addProduct, getProducts, ProductBody } from "./handlers/product";

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

  app.patch(
    "/api/game/score/:game",
    validateParams(GameParams),
    validateQuery(GameScoreQuery),
    validateBody(GameBody),
    catcher(setScore)
  );
  app.get(
    "/api/game/score/:game",
    validateParams(GameParams),
    validateQuery(GameScoreQuery),
    catcher(getScore)
  );
  app.get(
    "/api/game/leaderboard/:game",
    validateParams(GameParams),
    validateQuery(PaginationQuery),
    catcher(getLeaderboard)
  );

  app.put(
    "/api/store/categories",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateBody(CategoryBody),
    catcher(addCategory)
  );
  app.get("/api/store/categories", catcher(getCategories));
  app.get(
    "/api/store/categories/:id",
    validateParams(CategoryParams),
    catcher(getCategory)
  );
  app.patch(
    "/api/store/categories/:id",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(CategoryParams),
    validateBody(CategoryBody),
    catcher(setCategory)
  );

  app.put(
    "/api/store/products",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateBody(ProductBody),
    catcher(addProduct)
  );
  app.get(
    "/api/store/products",
    validateQuery(PaginationQuery.and(SortingQuery)),
    catcher(getProducts)
  );

  app.listen(API_PORT, () => console.info(`Listening on :${API_PORT}`));
};

main();
