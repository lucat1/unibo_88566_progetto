import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Product, shadow } from "../models/product";
import type { IPaginationQuery, ISortingQuery } from "./pagination";

const POPULATE = ["category", "subcategory"];

export const ProductBody = z.object({
  name: z.string(),
  description: z.string().optional().default(""),
  price: z.number(),
  photos: z.array(z.string()).optional().default([]),
  category: z.number().optional(),
  subcategory: z.number().optional(),
});
export type IProductBody = z.infer<typeof ProductBody>;

export const addProduct: RequestHandler = async (req, res) => {
  const data = req.body as IProductBody;
  const product = new Product(data);
  await product.save();
  json(res, 200, shadow(product));
};

export const getProducts: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;

  const result = await Product.paginate(
    {},
    {
      limit,
      page,
      sort: sort ? { [sort]: order } : {},
      populate: POPULATE,
    }
  );

  json(res, 200, { ...result, docs: result.docs.map(shadow) });
};

export const ProductParams = z.object({
  id: z.string().uuid(),
});
export type IProductParams = z.infer<typeof ProductParams>;

export const getProduct: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IProductParams;
  const product = await Product.findOne({ _id: id }).populate(POPULATE).exec();
  if (product == null)
    json(res, 404, {
      message: "Invalid product id",
    });
  else json(res, 200, shadow(product));
};

export const deleteProduct: RequestHandler = async (req, res) => {
  // TODO missing implementation
};

export const setProduct: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IProductParams;
  const patch = req.body as IProductBody;
  const updated = await Product.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid product id",
    });
  else json(res, 200, shadow(updated));
};
