import polka, { Middleware } from "polka";
import type { RequestHandler } from "express";
// @ts-ignore
import send from "@polka/send-type";
import sirv from "sirv";
import { json } from "body-parser";
import cookies from "cookie-parser";
import cors from "cors";

import { join } from "path";
import { readFile } from "fs/promises";
import { API_PORT, API_ENDPOINT } from "../../endpoints.json";
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
import validate from "./validate";

const sites = ["game", "frontoffice", "backoffice"],
  app = polka();

const main = async () => {
  /* Serve all front sites in production */
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

  app.use("/api", cors());
  app.use("/api", cookies());
  app.use("/api", json());
  app.use("/api", authMiddleware);

  app.post(
    "/api/auth/register",
    authNotRequired,
    validate(RegisterData),
    register
  );
  app.post(
    "/api/auth/login",
    authNotRequired,
    validate(LoginData),
    login((username, password) => ({ id: "testid", level: 1 }))
  );

  app.get("/api/auth/id", authNotRequired, (_, res) => {
    res.end("worked");
  });
  app.get("/api/auth/me", authRequired, (req, res) => {
    res.end(JSON.stringify((req as AuthenticatedRequest).user));
  });

  app.listen(API_PORT, () => {
    console.log(`Running on localhost:${API_PORT}`);
  });
};

main();
