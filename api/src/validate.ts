import type { Middleware } from "polka";
import type { Schema } from "zod";
// @ts-ignore
import send from "@polka/send-type";

const validator =
  (schema: Schema): Middleware =>
  (req, res, next) => {
    const result = schema.safeParse(req.body as Object);
    if (result.success) {
      req.body = result.data;
      next(null);
    } else
      send(
        res,
        400,
        JSON.stringify({
          error: result.error,
        }),
        {
          "Content-Type": "application/json",
        }
      );
  };

export default validator;
