import polka from "polka";
// @ts-ignore
import send from "@polka/send-type";
import sirv from "sirv";
import { join } from "path";
import { readFile } from "fs/promises";

import { API_PORT, API_ENDPOINT } from "../../endpoints.json";

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

  app.get("/api/hello", (req, res) => {
    res.end("hello world");
  });

  app.listen(API_PORT, () => {
    console.log(`Running on localhost:${API_PORT}`);
  });
};

main();
