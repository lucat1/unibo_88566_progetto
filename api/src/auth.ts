import type { Middleware } from "polka";
import type { RequestHandler } from "express";
import type { IncomingMessage } from "http";
// @ts-ignore
import send from "@polka/send-type";
import { z } from "zod";
import type { UserLevel } from "./models/user";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../../endpoints.json";

const COOKIE_NAME = "animal-auth";

export const RegisterData = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(),
  city: z.string().optional(),
});
export type IRegisterData = z.infer<typeof RegisterData>;

export const LoginData = z.object({
  username: z.string(),
  password: z.string(),
});
type ILoginData = z.infer<typeof LoginData>;

export interface AuthUser {
  id: string;
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
    if ((result as AuthError).message)
      send(res, 500, JSON.stringify(result), {
        "Content-Type": "application/json",
      });
    else
      send(res, 500, JSON.stringify(jwtResponse(result as AuthUser)), {
        "Content-Type": "application/json",
      });
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
    if ((result as AuthError).message)
      send(res, 500, JSON.stringify(result), {
        "Content-Type": "application/json",
      });
    else
      send(res, 500, JSON.stringify(jwtResponse(result as AuthUser)), {
        "Content-Type": "application/json",
      });
  };

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
