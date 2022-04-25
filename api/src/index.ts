import polka, { Middleware } from "polka";
// @ts-ignore
import send from "@polka/send-type";
import sirv from "sirv";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { join } from "path";
import { readFile } from "fs/promises";
import { API_PORT, API_ENDPOINT, AUTH_SECRET } from "../../endpoints.json";

const sites = ["game", "frontoffice", "backoffice"],
  app = polka();

const generateAuthMiddleware =
  (required: boolean): Middleware =>
  (req, res, next) => {
    if (req.isAuthenticated() == required) next();
    else
      send(
        res,
        500,
        JSON.stringify({
          error: required
            ? "Authentication is required"
            : "Authentication is NOT required",
        }),
        {
          "Content-Type": "application/json",
        }
      );
  };
const authRequired = generateAuthMiddleware(true);
const authNotRequired = generateAuthMiddleware(false);

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

  passport.use(
    new LocalStrategy({}, (username, password, done) => {
      if (username == password) return done(null, { username, id: "test" });
      else return done(new Error("some error"), null);
    })
  );

  app.use(
    session({
      secret: AUTH_SECRET,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/api/auth/login", passport.authenticate("local"), (_, res) => {
    res.end("worked");
  });

  app.get("/api/auth/id", authNotRequired, (_, res) => {
    res.end("worked");
  });
  app.get("/api/auth/me", authRequired, (req, res) => {
    res.end(JSON.stringify(req.user));
  });

  app.listen(API_PORT, () => {
    console.log(`Running on localhost:${API_PORT}`);
  });
};

main();
