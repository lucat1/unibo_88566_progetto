import type { Document } from "mongoose";
import type { ICategory } from "./category";

export enum UserLevel {
  BASIC,
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

  pets: IUserPet[];
}

export interface IUserPet extends Document {
  name: string;
  category: ICategory
}
