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
import { UserLevel } from "shared/models/user";
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
  CategoryBody,
  CategoryParams,
  addCategory,
  getCategories,
  getCategory,
  deleteCategory,
  setCategory,
  addSubcategory,
  getSubcategories,
  getSubcategory,
  deleteSubcategory,
  setSubcategory,
} from "./handlers/category";
import {
  ProductBody,
  ProductParams,
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  setProduct,
} from "./handlers/product";

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

  app.get(
    "/api/store/products",
    validateQuery(PaginationQuery.and(SortingQuery)),
    catcher(getProducts)
  );
  app.put(
    "/api/store/products",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateBody(ProductBody),
    catcher(addProduct)
  );
  app.get(
    "/api/store/products/:id",
    validateParams(ProductParams),
    catcher(getProduct)
  );
  app.delete(
    "/api/store/products/:id",
    validateParams(ProductParams),
    catcher(deleteProduct)
  );
  app.patch(
    "/api/store/products/:id",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(ProductParams),
    validateBody(ProductBody),
    catcher(setProduct)
  );

  // app.get("/api/store/services", catcher(getServices));
  // app.put(
  //   "/api/store/services",
  //   authRequired,
  //   priviledged(UserLevel.MANAGER),
  //   validateBody(ServiceBody),
  //   catcher(addService)
  // );
  // app.get(
  //   "/api/store/services/:id",
  //   validateParams(ServiceParams),
  //   catcher(getService)
  // );
  // app.delete(
  //   "/api/store/services/:id",
  //   validateParams(ServiceParams),
  //   catcher(deleteService)
  // );
  // app.patch(
  //   "/api/store/services/:id",
  //   authRequired,
  //   priviledged(UserLevel.MANAGER),
  //   validateParams(ServiceParams),
  //   validateBody(ServiceBody),
  //   catcher(setService)
  // );

  app.get("/api/store/categories", catcher(getCategories));
  app.put(
    "/api/store/categories",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateBody(CategoryBody),
    catcher(addCategory)
  );
  app.get(
    "/api/store/categories/:id",
    validateParams(CategoryParams),
    catcher(getCategory)
  );
  app.delete(
    "/api/store/categories/:id",
    validateParams(CategoryParams),
    catcher(deleteCategory)
  );
  app.patch(
    "/api/store/categories/:id",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(CategoryParams),
    validateBody(CategoryBody),
    catcher(setCategory)
  );

  app.get(
    "/api/store/categories/:id/subcategories",
    validateParams(CategoryParams),
    catcher(getSubcategories)
  );
  app.put(
    "/api/store/categories/:id/subcategories",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(CategoryParams),
    validateBody(CategoryBody),
    catcher(addSubcategory)
  );
  app.get(
    "/api/store/subcategories/:id",
    validateParams(CategoryParams),
    catcher(getSubcategory)
  );
  app.delete(
    "/api/store/subcategories/:id",
    validateParams(CategoryParams),
    catcher(deleteSubcategory)
  );
  app.patch(
    "/api/store/subcategories/:id",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(CategoryParams),
    validateBody(CategoryBody),
    catcher(setSubcategory)
  );

  app.listen(API_PORT, () => console.info(`Listening on :${API_PORT}`));
};

main();
