import type { Document } from "mongoose";

export enum UserLevel {
  BASIC,
  MANAGER,
}

export interface IUserPet extends Document {
  name: string;
  type: string;
  sex: 'not given' | 'male' | 'female'
  age: number
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
