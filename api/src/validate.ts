import type { Middleware } from "polka";
import type { RequestHandler } from "express";
import type { Schema } from "zod";
// @ts-ignore
import send from "@polka/send-type";
import { resolve } from "path";

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
          message: "Invalid request body",
          error: result.error,
        }),
        {
          "Content-Type": "application/json",
        }
      );
  };

export const catcher =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    try {
      fn(req, res, next);
    } catch (err) {
      console.error(err);
      send(
        res,
        500,
        JSON.stringify({
          message: "Internal server error",
          error: err,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    }
  };

export default validator;
