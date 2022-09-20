import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import { shadow as shadowUser } from "./user";
import type { IPost, IBoard } from 'shared/models/board'
import type { IUser } from "shared/models/user";

const PostSchema = new Schema<IPost>({
  _id: { type: String, default: v4 },
  message: { type: String, required: true },
  photos: [String],
  author: { type: String, ref: "User" },
  board: { type: String, ref: "Board" },
});
PostSchema.plugin(paginate);

const BoardSchema = new Schema<IBoard>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  author: { type: String, ref: "User" },
});
BoardSchema.plugin(paginate);

export const Post: PaginateModel<IPost> = model<IPost>("Post", PostSchema
) as PaginateModel<IPost>;

export const Board: PaginateModel<IBoard> = model<IBoard>("Board", BoardSchema
) as PaginateModel<IBoard>;

export const shadowPost = ({ _id, message, photos, author }: IPost) => ({
  _id,
  message,
  photos,
  author: typeof author == "undefined"
    ? undefined
    : typeof author == "string"
      ? { _id: author }
      : shadowUser(author as IUser),
});
export const shadowBoard = ({ _id, name, author }: IBoard) => ({
  _id, name, author: typeof author == "undefined"
    ? undefined
    : typeof author == "string"
      ? { _id: author }
      : shadowUser(author as IUser),
});
