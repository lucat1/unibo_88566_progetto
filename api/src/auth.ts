import type { Middleware } from "polka";
import type { RequestHandler } from "express";
import type { IncomingMessage } from "http";
import { z } from "zod";
import { promisify } from "util";
import { Secret, sign, verify } from "jsonwebtoken";
import { v4 } from "node-uuid";

import json from "./res";
import type { UserLevel } from "shared/models/user";
import { JWT_SECRET } from "shared/endpoints";

export const RegisterData = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string().optional().default(""),
  city: z.string().optional().default("World"),
  fromuuid: z.string().uuid().nullable().optional().default(null),
});
export type IRegisterData = z.infer<typeof RegisterData>;

export const LoginData = z.object({
  username: z.string(),
  password: z.string(),
});
type ILoginData = z.infer<typeof LoginData>;

export interface AuthUser {
  _id: string;
  level: UserLevel;
}

export interface AuthError {
  message: string;
}

export interface AuthenticatedRequest extends IncomingMessage {
  user?: AuthUser;
}

const jwtResponse = (data: AuthUser) => ({
  token: sign(data, JWT_SECRET),
});

export const register =
  (
    registerUser: (user: IRegisterData) => Promise<AuthUser | AuthError>
  ): RequestHandler =>
    async (req, res) => {
      const data = req.body as IRegisterData;
      const result = await registerUser(data);
      if ((result as AuthError).message) json(res, 500, result);
      else json(res, 200, jwtResponse(result as AuthUser));
    };

export const login =
  (
    findUser: (
      username: string,
      password: string
    ) => Promise<AuthUser | AuthError>
  ): RequestHandler =>
    async (req, res) => {
      const data = req.body as ILoginData;
      const result = await findUser(data.username, data.password);
      if ((result as AuthError).message) json(res, 500, result);
      else json(res, 200, jwtResponse(result as AuthUser));
    };

export const authMiddleware: Middleware = async (req, _, next) => {
  try {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const payload: AuthUser = await promisify<string, Secret, any>(verify)(
        req.headers.authorization.replace("Bearer ", ""),
        JWT_SECRET
      );
      (req as AuthenticatedRequest).user = payload;
    }
  } catch (_) { }
  next(null);
};

const generateAuthMiddleware =
  (required: boolean): Middleware =>
    (req, res, next) => {
      const isAuthenticated = (req as AuthenticatedRequest).user != undefined;
      if (isAuthenticated == required) next();
      else
        json(res, 401, {
          message: "Authentication error",
          error: required
            ? "Authentication is required"
            : "Authentication is NOT required",
        });
    };
export const authRequired = generateAuthMiddleware(true);
export const authNotRequired = generateAuthMiddleware(false);
export const priviledged =
  (level: UserLevel): Middleware =>
    (req, res, next) => {
      const { user } = req as AuthenticatedRequest;
      const ul = user?.level || 0;
      if (ul >= level) next(null);
      else
        json(res, 403, {
          message: "Higher priviledges are required",
          error: `Your level is ${ul}<${level}`,
        });
    };
