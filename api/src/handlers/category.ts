import type { RequestHandler, Request } from "express";
// @ts-ignore
import send from "@polka/send-type";
import { z } from "zod";

import { ISubcategory, ICategory, Category } from "../models/category";

export const CategoryBody = z.object({
  name: z.string(),
});
export type ICategoryBody = z.infer<typeof CategoryBody>;

const shadow = ({ _id, name }: ISubcategory | ICategory) => ({
  _id,
  name,
});

export const addCategory: RequestHandler = async (req, res) => {
  const { name } = req.body as ICategoryBody;
  const category = new Category({ name });
  await category.save();
  send(res, 200, JSON.stringify(shadow(category)), {
    "Content-Type": "application/json",
  });
};

export const getCategories: RequestHandler = async (_, res) => {
  const categories = await Category.find().exec();
  send(res, 200, JSON.stringify(categories.map(shadow)), {
    "Content-Type": "application/json",
  });
};
