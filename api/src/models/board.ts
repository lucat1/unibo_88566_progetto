import { Schema, Document, model } from "mongoose";
import { v4 } from "node-uuid";
import { autoIncrement } from "mongoose-plugin-autoinc-fix";
import type { IUser } from "shared/models/user";

export interface IPost extends Document<number> {
  name: string;
  message: string;
  photos: string[];
  author: IUser;
  parent: IBoard;
}

export interface IBoard extends Document<number> {
  name: string;
  description: string;
  posts: IPost[];
}

const PostSchema = new Schema<IPost>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  message: { type: String, required: true },
  photos: [String],
  author: { type: Number, ref: "User" },
  parent: { type: Number, ref: "Board" },
});
PostSchema.plugin(autoIncrement, "Post");

const BoardSchema = new Schema<IBoard>({
  name: { type: String, required: true },
  description: String,
  posts: [{ type: Number, ref: "Post" }],
});
BoardSchema.plugin(autoIncrement, "Board");

export const Post = model<IPost>("Post", PostSchema);

export const Board = model<IBoard>("Board", BoardSchema);

export const shadowPost = ({ _id, name, parent }: IPost) => ({
  _id,
  name,
  parent: typeof parent == "number" ? parent : parent._id,
});
export const shadowBoard = ({ _id, name }: IBoard) => ({ _id, name });
