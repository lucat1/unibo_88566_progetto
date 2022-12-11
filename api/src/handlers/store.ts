import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Store, shadow } from "../models/store";
import type { IPaginationQuery, ISortingQuery } from "./pagination";

export const StoreBody = z.object({
  name: z.string().min(1),
  location: z.tuple([z.number(), z.number()]),
});
export type IStoreBody = z.infer<typeof StoreBody>;

export const addStore: RequestHandler = async (req, res) => {
  const data = req.body as IStoreBody;
  const store = new Store(data);
  await store.save();
  json(res, 200, shadow(store));
};

export const getStores: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;

  const result = await Store.paginate(
    {},
    {
      limit,
      page,
      sort: sort ? { [sort]: order } : {},
    }
  );

  json(res, 200, { ...result, docs: result.docs.map(shadow) });
};

export const StoreParams = z.object({
  id: z.string().uuid(),
});
export type IStoreParams = z.infer<typeof StoreParams>;

export const getStore: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IStoreParams;
  const store = await Store.findOne({ _id: id }).exec();
  if (store == null)
    json(res, 404, {
      message: "Invalid store id",
    });
  else json(res, 200, shadow(store));
};

export const deleteStore: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IStoreParams;
  await Store.deleteOne({ _id: id }).exec();
  json(res, 200, null);
};

export const setStore: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IStoreParams;
  const patch = req.body as IStoreBody;
  const updated = await Store.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid store id",
    });
  else json(res, 200, shadow(updated));
};
