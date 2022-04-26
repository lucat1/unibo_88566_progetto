import polka, { Middleware } from "polka";
import type { RequestHandler } from "express";
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
  authMiddleware,
  login,
  register,
  authRequired,
  authNotRequired,
  AuthenticatedRequest,
  LoginData,
  RegisterData,
} from "./auth";
import validate, { catcher } from "./validate";
import { authenticateUser, registerUser } from "./accounts";
import { User } from "./models/user";

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
    validate(RegisterData),
    register(registerUser)
  );
  app.post(
    "/api/auth/login",
    authNotRequired,
    validate(LoginData),
    login(authenticateUser)
  );

  app.get("/api/auth/id", authNotRequired, (_, res) => {
    res.end("worked");
  });
  app.get(
    "/api/auth/me",
    authRequired,
    catcher(async (req, res) => {
      const user = await User.findOne(
        (req as AuthenticatedRequest).user
      ).exec();
      if (user == null) throw new Error("User not found");
      send(res, 200, JSON.stringify(user), {
        "Content-Type": "application/json",
      });
    })
  );

  app.listen(API_PORT, () => console.info(`Listening on :${API_PORT}`));
};

main();
