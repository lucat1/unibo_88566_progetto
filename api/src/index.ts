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
import {
  register,
  login,
  password,
  getMe,
  deleteMe,
  patchMe,
  id,
} from "./handlers/auth";
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
  BoardBody,
  BoardParams,
  PostBody,
  addBoard,
  getBoards,
  getBoard,
  deleteBoard,
  setBoard,
  addPost,
  getPosts,
  getPost,
  deletePost,
  setPost,
} from "./handlers/board";
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

  app.get("/api/auth/id", authNotRequired, id);
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
  app.patch("/api/auth/password", authRequired, catcher(password));
  app.get("/api/auth/me", authRequired, catcher(getMe));
  app.delete("/api/auth/me", authRequired, catcher(deleteMe));
  app.patch("/api/auth/me", authRequired, catcher(patchMe));

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
    "/api/community/boards/",
    validateQuery(PaginationQuery.and(SortingQuery)),
    catcher(getBoards)
  );
  app.put(
    "/api/community/boards/",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateBody(BoardBody),
    catcher(addBoard)
  );
  app.get(
    "/api/community/boards/:id/",
    validateParams(BoardParams),
    catcher(getBoard)
  );
  app.put(
    "/api/community/boards/:id/",
    authRequired,
    priviledged(UserLevel.BASIC),
    validateParams(BoardParams),
    validateBody(PostBody),
    catcher(addPost)
  );
  app.delete(
    "/api/community/boards/:id/",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(BoardParams),
    catcher(deleteBoard)
  );
  app.patch(
    "/api/community/boards/:id/",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(BoardParams),
    validateBody(BoardBody),
    catcher(setBoard)
  );
  app.delete(
    "/api/community/posts/:id/",
    authRequired,
    priviledged(UserLevel.BASIC),
    validateParams(BoardParams),
    catcher(deletePost)
  );
  app.patch(
    "/api/community/posts/:id/",
    authRequired,
    priviledged(UserLevel.BASIC),
    validateParams(BoardParams),
    validateBody(PostBody),
    catcher(setPost)
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
