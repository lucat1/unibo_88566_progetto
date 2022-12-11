import type { RequestHandler } from "express";
import { z } from "zod";
import { v4 } from "node-uuid";
import { hash, compare } from "bcrypt";
import { UserLevel } from "shared/models/user";
import { PASSWORD_SALT_ROUNDS } from "shared/endpoints";

import type { IPaginationQuery, ISortingQuery } from "./pagination";
import json from "../res";
import { User, shadow } from "../models/user";
import type { AuthenticatedRequest, AuthUser, AuthError } from "../auth";
import type { IRegisterData } from "../auth";

const POPULATE = ["pets"];

export const register = async (
  data: IRegisterData
): Promise<AuthUser | AuthError> => {
  try {
    if ((await User.findOne({ username: data.username }).exec()) != null)
      return { message: "This username is already taken" };

    const { fromuuid, frompets, ...other } = data;
    const user = new User({
      _id: fromuuid ? fromuuid : v4(),
      ...other,
      pets: frompets ? frompets : [],
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
  if (user == null) {
    json(res, 200, null);
    return;
  }
  const { password } = req.body as unknown as IPasswordData;
  user.password = password;
  await user.save();
  json(res, 200, shadow(user));
};

export const upgrade: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) {
    json(res, 200, null);
    return;
  }

  user.level = UserLevel.MANAGER;
  await user.save();
  json(res, 200, shadow(user));
};

export const id: RequestHandler = (_, res) => {
  json(res, 200, { id: v4() });
};

export const getMe: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user)
    .populate(POPULATE)
    .exec();
  json(res, 200, user != null ? shadow(user) : null);
};

export const UserPetBody = z.object({
  name: z.string(),
  type: z.string(),
  sex: z.enum(["not given", "male", "female"]),
  age: z.number(),
});

export const UserBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  city: z.string().optional(),
  avatar: z.string().optional(),
  password: z.string().optional(),

  pets: z.array(UserPetBody),
  favourites: z.array(z.string()).optional(),
});
export type IUserBody = z.infer<typeof UserBody>;

export const patchMe: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) {
    json(res, 200, null);
    return;
  }
  const patch = req.body as unknown as IUserBody;
  const updated = await User.findOneAndUpdate({ _id: user._id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Unkown error",
    });
  else json(res, 200, shadow(updated));
};

export const deleteMe: RequestHandler = async (req, res) => {
  await User.deleteOne((req as AuthenticatedRequest).user).exec();
  json(res, 200, null);
};

export const UserParams = z.object({
  id: z.string().uuid(),
});
export type IUserParams = z.infer<typeof UserParams>;

export const getUsers: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;

  const result = await User.paginate(
    {},
    {
      limit,
      page,
      sort: sort ? { [sort]: order } : {},
      populate: POPULATE,
    }
  );

  json(res, 200, { ...result, docs: result.docs.map(shadow) });
};

export const getUser: RequestHandler = async (req, res) => {
  const { id } = req.params as IUserParams;
  const user = await User.findOne({ _id: id }).populate(POPULATE).exec();
  json(res, 200, user != null ? shadow(user) : null);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IUserParams;
  await User.deleteOne({ _id: id }).exec();
  json(res, 200, null);
};

export const setUser: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IUserParams;
  const patch = req.body as IUserBody;
  if (patch.password)
    patch.password = await hash(patch.password, PASSWORD_SALT_ROUNDS);

  const updated = await User.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid user id",
    });
  else json(res, 200, shadow(updated));
};
