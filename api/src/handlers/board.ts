import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Board, Post, shadowBoard, shadowPost } from "../models/board";
import { User } from "../models/user";
import type { AuthenticatedRequest } from "../auth";
import type { IPaginationQuery, ISortingQuery } from "./pagination";
import { UserLevel } from "shared/models/user";

const POPULATE = ["author"];

export const BoardBody = z.object({
  name: z.string().min(1),
});
export type IBoardBody = z.infer<typeof BoardBody>;

export const addBoard: RequestHandler = async (req, res) => {
  const { name } = req.body as IBoardBody;
  const author = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (author == null) throw new Error("User not found");
  const board = new Board({ name, author });
  await board.save();
  json(res, 200, shadowBoard(board));
};

export const getBoards: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;
  const result = await Board.paginate(
    {},
    {
      limit,
      page,
      sort: sort ? { [sort]: order } : {},
      populate: POPULATE,
    }
  );
  json(res, 200, { ...result, docs: result.docs.map(shadowBoard) });
};

export const BoardParams = z.object({
  id: z.string().uuid(),
});
export type IBoardParams = z.infer<typeof BoardParams>;

export const PostParams = z.object({
  id: z.string().uuid(),
  post: z.string().uuid(),
});
export type IPostParams = z.infer<typeof PostParams>;

export const getBoard: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const { limit, page } = req.query as unknown as IPaginationQuery;
  const board = await Board.findOne({ _id: id }).populate(POPULATE).exec();
  if (board == null) {
    json(res, 404, {
      message: "Invalid board id",
    });
    return;
  }
  const result = await Post.paginate(
    { board: { _id: board._id } },
    {
      limit,
      page,
      populate: POPULATE,
    }
  );
  json(res, 200, {
    ...result,
    ...shadowBoard(board),
    docs: result.docs.map(shadowPost),
  });
};

export const deleteBoard: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const author = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (author == null) throw new Error("User not found");
  const board = await Board.findOne({ _id: id }).populate(POPULATE).exec();
  if (board == null) {
    json(res, 404, {
      message: "Invalid board id",
    });
    return;
  }
  if (author.level != UserLevel.MANAGER && board.author._id != author._id)
    throw new Error("You don't own this board");

  await Post.deleteMany({ board: id }).exec();
  await board.delete();
  json(res, 200, null);
};

export const setBoard: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const patch = req.body as IBoardBody;
  const author = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (author == null) throw new Error("User not found");
  const board = await Board.findOne({ _id: id }).populate(POPULATE).exec();
  if (board == null) {
    json(res, 404, {
      message: "Invalid board id",
    });
    return;
  }
  if (author.level != UserLevel.MANAGER && board.author._id != author._id)
    throw new Error("You don't own this board");
  await board.update(patch, { new: true }).exec();
  json(res, 200, shadowBoard(board));
};

export const PostBody = z.object({
  message: z.string().min(1),
  photos: z.array(z.string()).optional().default([]),
});
export type IPostBody = z.infer<typeof PostBody>;

export const getPosts: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const subcategories = await Post.find({ parent: { _id: id } }).exec();
  json(res, 200, subcategories.map(shadowPost));
};

export const getPost: RequestHandler = async (req, res) => {
  const { post: post_id } = req.params as unknown as IPostParams;
  const post = await Post.findOne({ _id: post_id }).exec();
  if (post == null)
    json(res, 404, {
      message: "Invalid post id",
    });
  else json(res, 200, shadowPost(post));
};

export const addPost: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const { message, photos } = req.body as IPostBody;
  const author = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (author == null) throw new Error("User not found");
  const post = new Post({ message, photos, author, board: { _id: id } });
  await post.save();
  json(res, 200, shadowPost(post));
};

export const deletePost: RequestHandler = async (req, res) => {
  const { id, post } = req.params as unknown as IPostParams;
  const author = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (author == null) throw new Error("User not found");
  const postObj = await Post.findOne({ board: { _id: id }, _id: post })
    .populate(POPULATE)
    .exec();
  if (postObj == null) {
    json(res, 404, {
      message: "Invalid post/board id",
    });
    return;
  }
  if (author.level != UserLevel.MANAGER && postObj.author._id != author._id)
    throw new Error("You don't own this post");

  await postObj.delete();
  json(res, 200, null);
};

export const setPost: RequestHandler = async (req, res) => {
  const { id, post } = req.params as unknown as IPostParams;
  const patch = req.body as IPostBody;
  const author = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (author == null) throw new Error("User not found");
  const postObj = await Post.findOne({ board: { _id: id }, _id: post })
    .populate(POPULATE)
    .exec();
  if (postObj == null) {
    json(res, 404, {
      message: "Invalid post/board id",
    });
    return;
  }
  if (author.level != UserLevel.MANAGER && postObj.author._id != author._id)
    throw new Error("You don't own this post");
  await postObj.update(patch, { new: true }).exec();
  json(res, 200, shadowPost(postObj));
};
