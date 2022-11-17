import polka from "polka";
// @ts-ignore
import send from "@polka/send-type";
import sirv from "sirv";
import { json } from "body-parser";
import cors from "cors";
import { connect } from "mongoose";

import { join } from "path";
import { readFile } from "fs/promises";
import { API_PORT, API_ENDPOINT, MONGO_URL } from "shared/endpoints";
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
import {
  ImageParams,
  ImageQuery,
  serve as serveImage,
  upload as uploadImage,
} from "./handlers/upload";
import {
  register,
  login,
  password,
  upgrade,
  getMe,
  deleteMe,
  patchMe,
  id,
  PasswordData,
  UserData,
  UserParams,
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
  deletePost,
  setPost,
  PostParams,
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
import {
  ServiceBody,
  ServiceParams,
  ServiceRandomParams,
  addService,
  getServices,
  getRandomServices,
  getService,
  deleteService,
  setService,
} from "./handlers/service";
import {
  StoreBody,
  StoreParams,
  addStore,
  getStores,
  getStore,
  deleteStore,
  setStore,
} from "./handlers/store";
import { addOrder, deleteOrder, getOrder, getOrders, OrderBody, OrderPrams } from "./handlers/order";
import { addPet, deletePet, getPet, getPets, PetBody, setPet } from "./handlers/pet";

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
    // authNotRequired,
    validateBody(RegisterData),
    registerWrapper(register)
  );
  app.post(
    "/api/auth/login",
    // authNotRequired,
    validateBody(LoginData),
    loginWrapper(login)
  );
  app.patch(
    "/api/auth/password",
    authRequired,
    validateBody(PasswordData),
    catcher(password)
  );
  app.get("/api/auth/me", authRequired, catcher(getMe));
  app.delete("/api/auth/me", authRequired, catcher(deleteMe));
  app.patch(
    "/api/auth/me",
    authRequired,
    validateBody(UserData),
    catcher(patchMe)
  );
  app.post("/api/auth/upgrade", authRequired, catcher(upgrade));

  app.get("/api/user/:id", validateParams(UserParams), catcher(upgrade));

  app.get("/api/images/:id", validateParams(ImageParams), catcher(serveImage));
  app.put(
    "/api/images",
    authRequired,
    validateQuery(ImageQuery),
    catcher(uploadImage)
  );

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
    validateBody(BoardBody),
    catcher(addBoard)
  );
  app.get(
    "/api/community/boards/:id/",
    validateParams(BoardParams),
    validateQuery(PaginationQuery),
    catcher(getBoard)
  );
  app.patch(
    "/api/community/boards/:id/",
    authRequired,
    validateParams(BoardParams),
    validateBody(BoardBody),
    catcher(setBoard)
  );
  app.put(
    "/api/community/boards/:id/",
    authRequired,
    validateParams(BoardParams),
    validateBody(PostBody),
    catcher(addPost)
  );
  app.delete(
    "/api/community/boards/:id/",
    authRequired,
    validateParams(BoardParams),
    catcher(deleteBoard)
  );
  app.delete(
    "/api/community/boards/:id/:post",
    authRequired,
    validateParams(PostParams),
    catcher(deletePost)
  );
  app.patch(
    "/api/community/posts/:id/",
    authRequired,
    validateParams(PostParams),
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

  app.get(
    "/api/store/pets",
    validateQuery(PaginationQuery.and(SortingQuery)),
    catcher(getPets)
  );
  app.put(
    "/api/store/pets",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateBody(PetBody),
    catcher(addPet)
  );
  app.get(
    "/api/store/pets/:id",
    validateParams(ProductParams),
    catcher(getPet)
  );
  app.delete(
    "/api/store/pet/:id",
    validateParams(ProductParams),
    catcher(deletePet)
  );
  app.patch(
    "/api/store/pets/:id",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(ProductParams),
    validateBody(ProductBody),
    catcher(setPet)
  );

  app.get(
    "/api/store/orders/",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateQuery(PaginationQuery.and(SortingQuery)),
    catcher(getOrders)
  );
  app.put(
    "/api/store/orders/",
    authRequired,
    validateBody(OrderBody),
    catcher(addOrder)
  );
  app.get(
    "/api/store/orders/:id/",
    authRequired,
    validateParams(OrderPrams),
    catcher(getOrder)
  );
  app.delete(
    "/api/store/orders/:id/",
    authRequired,
    validateParams(OrderPrams),
    catcher(deleteOrder)
  );

  app.get(
    "/api/store/services",
    validateQuery(PaginationQuery.and(SortingQuery)),
    catcher(getServices)
  );
  app.get(
    "/api/store/services/random",
    validateQuery(ServiceRandomParams),
    catcher(getRandomServices)
  )
  app.put(
    "/api/store/services",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateBody(ServiceBody),
    catcher(addService)
  );
  app.get(
    "/api/store/services/:id",
    validateParams(ServiceParams),
    catcher(getService)
  );
  app.delete(
    "/api/store/services/:id",
    validateParams(ServiceParams),
    catcher(deleteService)
  );
  app.patch(
    "/api/store/services/:id",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(ProductParams),
    validateBody(ServiceBody),
    catcher(setService)
  );

  app.get(
    "/api/store/stores",
    validateQuery(PaginationQuery.and(SortingQuery)),
    catcher(getStores)
  );
  app.put(
    "/api/store/stores",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateBody(StoreBody),
    catcher(addStore)
  );
  app.get(
    "/api/store/stores/:id",
    validateParams(StoreParams),
    catcher(getStore)
  );
  app.delete(
    "/api/store/stores/:id",
    validateParams(StoreParams),
    catcher(deleteStore)
  );
  app.patch(
    "/api/store/stores/:id",
    authRequired,
    priviledged(UserLevel.MANAGER),
    validateParams(StoreParams),
    validateBody(StoreBody),
    catcher(setStore)
  );

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
