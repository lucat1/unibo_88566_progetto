import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Board, Post, shadowBoard, shadowPost } from "../models/board";

export const BoardBody = z.object({
  name: z.string(),
  description: z.string(),
});
export type IBoardBody = z.infer<typeof BoardBody>;

export const PostBody = z.object({
  name: z.string(),
  message: z.string(),
  photos: z.array(z.string()).optional().default([]),
});
export type IPostBody = z.infer<typeof PostBody>;

export const addBoard: RequestHandler = async (req, res) => {
  const { name, description } = req.body as IBoardBody;
  const board = new Board({ name, description });
  await board.save();
  json(res, 200, shadowBoard(board));
};

export const getBoards: RequestHandler = async (_, res) => {
  const categories = await Board.find().exec();
  json(res, 200, categories.map(shadowBoard));
};

export const BoardParams = z.object({
  id: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((n) => n >= 0, { message: "Board id must be unsigned" }),
});
export type IBoardParams = z.infer<typeof BoardParams>;

export const getBoard: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const board = await Board.findOne({ _id: id }).exec();
  if (board == null)
    json(res, 404, {
      message: "Invalid board id",
    });
  else json(res, 200, shadowBoard(board));
};

export const deleteBoard: RequestHandler = async (req, res) => {
  // TODO missing implementation
};

export const setBoard: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const patch = req.body as IBoardBody;
  const updated = await Board.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid board id",
    });
  else json(res, 200, shadowBoard(updated));
};

export const addPost: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const { name } = req.body as IBoardBody;
  const post = new Post({ name, parent: { _id: id } });
  await post.save();
  json(res, 200, shadowPost(post));
};

export const getPosts: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const subcategories = await Post.find({ parent: { _id: id } }).exec();
  json(res, 200, subcategories.map(shadowPost));
};

export const getPost: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const post = await Post.findOne({ _id: id }).exec();
  if (post == null)
    json(res, 404, {
      message: "Invalid post id",
    });
  else json(res, 200, shadowPost(post));
};

export const deletePost: RequestHandler = async (req, res) => {
  // TODO missing implementation
};

export const setPost: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IBoardParams;
  const patch = req.body as IPostBody;
  const updated = await Post.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid post id",
    });
  else json(res, 200, shadowPost(updated));
};
