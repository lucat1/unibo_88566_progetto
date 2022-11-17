import type { RequestHandler } from "express";
import { z } from "zod";
import { v4 } from "node-uuid";
import { compare } from "bcrypt";

import { UserLevel } from "shared/models/user";
import json from "../res";
import { User, shadow } from "../models/user";
import type { AuthenticatedRequest, AuthUser, AuthError } from "../auth";
import type { IRegisterData } from "../auth";

const POPULATE = ['pets']

export const register = async (
  data: IRegisterData
): Promise<AuthUser | AuthError> => {
  try {
    if ((await User.findOne({ username: data.username }).exec()) != null)
      return { message: "This username is already taken" };

    const user = new User({
      _id: data.fromuuid ? data.fromuuid : v4(),
      ...data,
      level: UserLevel.BASIC,
    });
    await user.save();
    return { _id: user._id, level: user.level };
  } catch (err) {
    console.error("Error while registering user:", err);
    return { message: "Internal server error" };
  }
};

export const login = async (
  username: string,
  password: string
): Promise<AuthUser | AuthError> => {
  try {
    const result = await User.findOne({ username }).exec();
    if (result == null) return { message: "Invalid username" };
    if (await compare(password, result.password))
      return { _id: result._id, level: result.level };
    else return { message: "Invalid password" };
  } catch (err) {
    console.error("Error while logging user in:", err);
    return { message: "Internal server error" };
  }
};

export const PasswordData = z.object({
  password: z.string().min(1),
});
export type IPasswordData = z.infer<typeof PasswordData>;

export const password: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  const { password } = req.body as unknown as IPasswordData;
  user.password = password;
  await user.save();
  json(res, 200, shadow(user));
};

export const upgrade: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");

  user.level = UserLevel.MANAGER;
  await user.save();
  json(res, 200, shadow(user));
};

export const id: RequestHandler = (_, res) => {
  json(res, 200, { id: v4() });
};

export const getMe: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).populate(POPULATE).exec();
  if (user == null) throw new Error("User not found");
  json(res, 200, shadow(user));
};

export const UserPetBody = z.object({
  name: z.string(),
  type: z.string()
})

export const UserBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  city: z.string().optional(),
  avatar: z.string().optional(),

  pets: z.array(UserPetBody)
});
export type IUserData = z.infer<typeof UserBody>;

export const patchMe: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  const patch = req.body as unknown as IUserData;
  const updated = await User.findOneAndUpdate({ _id: user._id }, patch, { new: true }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Unkown error",
    });
  else json(res, 200, shadow(updated));
};

export const deleteMe: RequestHandler = async (req, res) => {
  const user = await User.deleteOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  json(res, 200, null);
};

export const UserParams = z.object({
  id: z.string().uuid(),
});
export type IUserParams = z.infer<typeof UserParams>;

export const get: RequestHandler = async (req, res) => {
  const { id } = req.params as IUserParams;
  const user = await User.findOne({ _id: id }).populate(POPULATE).exec();
  if (user == null) throw new Error("User not found");
  json(res, 200, shadow(user));
};
