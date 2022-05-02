import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Product, shadow } from "../models/product";
import type { IPaginationQuery, ISortingQuery } from "./pagination";

export const ProductBody = z.object({
  name: z.string(),
  description: z.string().optional().default(""),
  price: z.number(),
  photos: z.array(z.string()).optional().default([]),
});
export type IProductBody = z.infer<typeof ProductBody>;

export const addProduct: RequestHandler = async (req, res) => {
  const data = req.body as IProductBody;
  const product = new Product(data);
  await product.save();
  json(res, 200, shadow(product));
};

export const getProducts: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } = req.query as unknown as (IPaginationQuery & ISortingQuery);

  const result = await Product.paginate(
    {},
    { limit, page, sort: sort ? { [sort]: order } : {} }
  );

  json(res, 200, { ...result, docs: result.docs.map(shadow) });
};
