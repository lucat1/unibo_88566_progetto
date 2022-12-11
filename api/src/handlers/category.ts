import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import {
  Category,
  Subcategory,
  shadowCategory,
  shadowSubcategory,
} from "../models/category";

export const CategoryBody = z.object({
  name: z.string().min(1),
});
export type ICategoryBody = z.infer<typeof CategoryBody>;

export const addCategory: RequestHandler = async (req, res) => {
  const { name } = req.body as ICategoryBody;
  const category = new Category({ name });
  await category.save();
  json(res, 200, shadowCategory(category));
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

export const deleteCategory: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ICategoryParams;
  await Category.deleteOne({ _id: id }).exec();
  json(res, 200, null);
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

export const addSubcategory: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ICategoryParams;
  const { name } = req.body as ICategoryBody;
  const subcategory = new Subcategory({ name, parent: { _id: id } });
  await subcategory.save();
  json(res, 200, shadowSubcategory(subcategory));
};

export const getSubcategories: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ICategoryParams;
  const subcategories = await Subcategory.find({ parent: { _id: id } }).exec();
  json(res, 200, subcategories.map(shadowSubcategory));
};

export const getSubcategory: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ICategoryParams;
  const subcategory = await Subcategory.findOne({ _id: id }).exec();
  if (subcategory == null)
    json(res, 404, {
      message: "Invalid subcategory id",
    });
  else json(res, 200, shadowSubcategory(subcategory));
};

export const deleteSubcategory: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ICategoryParams;
  await Subcategory.deleteOne({ _id: id }).exec();
  json(res, 200, null);
};

export const setSubcategory: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ICategoryParams;
  const patch = req.body as ICategoryBody;
  const updated = await Subcategory.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid subcategory id",
    });
  else json(res, 200, shadowSubcategory(updated));
};
