import type { Middleware } from "polka";
import type { Response, RequestHandler } from "express";
import type { Schema } from "zod";

import json from "./res";

export const generateValidator =
  (key: "body" | "params" | "query", errorMessage: string) =>
  (schema: Schema): Middleware =>
  (req, res, next) => {
    const result = schema.safeParse(req[key] as Object);
    if (result.success) {
      (req[key] as Object) = result.data;
      next(null);
    } else
      json(res, 400, {
        message: errorMessage,
        error: result.error,
      });
  };

export const validateBody = generateValidator("body", "Invalid request body");

export const validateParams = generateValidator(
  "params",
  "Invalid request url: wrong params"
);

export const validateQuery = generateValidator(
  "query",
  "Invalid request query"
);

const handler = (res: Response) => (err: Error) => {
  console.error("A catcher caught an error:", err);
  json(res, 500, {
    message: "Internal server error",
    error: err,
  });
};

export const catcher =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    const h = handler(res);
    try {
      const r = fn(req, res, next);
      if (typeof (r as any).catch == "function") (r as any).catch(h);
    } catch (err) {
      h(err as Error);
    }
  };
