import polka, { Middleware } from "polka";
import { API_PORT } from "../../endpoints.json";

const one: Middleware = (req, _, next) => {
  req.params = { ...req.params, hello: "world" };
  next();
};

polka()
  .use(one)
  .get("/users/:id", (req, res) => {
    console.log(`~> Hello, ${req.params.hello}`);
    res.end(`User: ${req.params.id}`);
  })
  .listen(API_PORT, () => {
    console.log(`> Running on localhost:${API_PORT}`);
  });
