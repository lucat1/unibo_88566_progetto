import { compare } from "bcrypt";
import type { AuthUser, AuthError } from "./auth";
import { User, UserLevel } from "./models/user";
import type { IRegisterData } from "./auth";

export const registerUser = async (
  data: IRegisterData
): Promise<AuthUser | AuthError> => {
  try {
    if ((await User.findOne({ username: data.username }).exec()) != null)
      return { message: "This username is already taken" };
    const user = new User({ ...data, level: UserLevel.BASIC });
    await user.save();
    return { id: user._id, level: user.level };
  } catch (err) {
    console.error(err);
    return { message: "Internal server error" };
  }
};

export const authenticateUser = async (
  username: string,
  password: string
): Promise<AuthUser | AuthError> => {
  try {
    const result = await User.findOne({ username }).exec();
    if (result == null) return { message: "Invalid username" };
    if (await compare(password, result.password))
      return { id: result._id, level: result.level };
    else return { message: "Invalid password" };
  } catch (err) {
    console.error(err);
    return { message: "Internal server error" };
  }
};
