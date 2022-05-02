import { Schema, model, Document } from "mongoose";
import { v4 } from "node-uuid";
import { hash } from "bcrypt";
import { PASSWORD_SALT_ROUNDS } from "../../../endpoints.json";
import type { IPet } from "./pet";

export enum UserLevel {
  BASIC,
  VIP,
  MANAGER,
}

export interface IUser extends Document {
  username: string;
  password: string;
  level: UserLevel;
  firstName: string;
  lastName?: string;
  city?: string;
  avatar?: string;

  pets: IPet[];
}

const UserSchema = new Schema<IUser>({
  _id: { type: String, default: v4 },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: {
    type: Number,
    required: true,
    enum: [UserLevel.BASIC, UserLevel.VIP, UserLevel.MANAGER],
  },
  firstName: { type: String, required: true },
  lastName: String,
  city: String,
  avatar: String,

  pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
});
UserSchema.pre("save", async function() {
  this.password = await hash(this.password, PASSWORD_SALT_ROUNDS);
});

export const User = model<IUser>("User", UserSchema);

export const shadow = ({
  _id,
  username,
  level,
  firstName,
  lastName,
  city,
}: IUser) => ({ _id, username, level, firstName, lastName, city });
