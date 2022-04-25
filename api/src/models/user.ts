import { Schema, model } from "mongoose";
import { v4 } from "node-uuid";

export enum UserLevel {
  BASIC,
  VIP,
  MANAGER,
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  level: UserLevel;
  firstName: string;
  lastName?: string;
  city?: string;

  avatar?: string;
}

export const User = model<IUser>(
  "User",
  new Schema<IUser>({
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
  })
);
