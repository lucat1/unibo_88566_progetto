import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Category, shadowCategory } from "../models/category";

export const CategoryBody = z.object({
  name: z.string(),
});
export type ICategoryBody = z.infer<typeof CategoryBody>;

export const addCategory: RequestHandler = async (req, res) => {
  const { name } = req.body as ICategoryBody;
  const category = new Category({ name });
  await category.save();
  json(res, 200, JSON.stringify(shadowCategory(category)));
};

export const getCategories: RequestHandler = async (_, res) => {
  const categories = await Category.find().exec();
  json(res, 200, categories.map(shadowCategory));
};

export const CategoryParams = z.object({
  id: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((n) => n >= 0, { message: "Category id must be unsigned" }),
});
export type ICategoryParams = z.infer<typeof CategoryParams>;

export const getCategory: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ICategoryParams;
  const category = await Category.findOne({ _id: id }).exec();
  if (category == null)
    json(res, 404, {
      message: "Invalid category id",
    });
  else json(res, 200, shadowCategory(category));
};

export const setCategory: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ICategoryParams;
  const patch = req.body as ICategoryBody;
  const updated = await Category.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid category id",
    });
  else json(res, 200, shadowCategory(updated));
};
