import type { Document } from "mongoose";
import type { IUser } from "./user";

export interface IPost extends Document {
  message: string;
  photos: string[];
  author: IUser;
  board: IBoard;
}

export interface IBoard extends Document {
  name: string;
  docs: IPost[];
  author: IUser;
}
