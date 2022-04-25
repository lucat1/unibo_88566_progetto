import type { Middleware } from "polka";
import type { RequestHandler } from "express";
import type { IncomingMessage } from "http";
// @ts-ignore
import send from "@polka/send-type";
import { z } from "zod";

const COOKIE_NAME = "animal-auth";

/* TODO: move inside the user model definition */
export enum UserLevel {
  UNREGISTERED,
  BASIC,
  VIP,
  MANAGER,
}

export const RegisterData = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});
type RegisterData = z.infer<typeof RegisterData>;

export const LoginData = z.object({
  username: z.string(),
  password: z.string(),
});
type LoginData = z.infer<typeof LoginData>;

export interface AuthUser {
  id: string;
  level: UserLevel;
}

export interface AuthenticatedRequest extends IncomingMessage {
  user?: AuthUser;
}

export const login =
  (
    findUser: (username: string, password: string) => AuthUser
  ): RequestHandler =>
  (req, res) => {
    const data = req.body as LoginData;
    console.log(data);
    res.end("logging in i guess");
  };

export const register: RequestHandler = (req, res) => {};

export const authMiddleware: Middleware = (req, res, next) => {
  if (req.cookies[COOKIE_NAME] && /* todo parse */ true)
    (req as AuthenticatedRequest).user = {} as AuthUser; /* todo parsed data */
  next();
};

const generateAuthMiddleware =
  (required: boolean): Middleware =>
  (req, res, next) => {
    const isAuthenticated = (req as AuthenticatedRequest).user != undefined;
    if (isAuthenticated == required) next();
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
export const authRequired = generateAuthMiddleware(true);
export const authNotRequired = generateAuthMiddleware(false);
