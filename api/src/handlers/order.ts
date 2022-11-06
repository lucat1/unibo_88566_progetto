import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Order, shadow } from "../models/order";
import { User } from "../models/user";
import type { AuthenticatedRequest } from "../auth";
import type { IPaginationQuery, ISortingQuery } from "./pagination";
import { UserLevel } from "shared/models/user";
const POPULATE = ["items.product", "user"];

export const ItemBody = z.object({
  product: z.string(),
  amount: z.number().min(1)
});
export type IItemBody = z.infer<typeof ItemBody>;
export const OrderBody = z.object({
  items: z.array(ItemBody)
});
export type IOrderBody = z.infer<typeof OrderBody>;

export const addOrder: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  const data = req.body as IOrderBody;
  const order = new Order({ ...data, user: user._id });
  await order.save();
  json(res, 200, shadow(order));
};

export const getOrders: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;

  const result = await Order.paginate(
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

export const OrderPrams = z.object({
  id: z.string().uuid(),
});
export type IOrderParams = z.infer<typeof OrderPrams>;

export const getOrder: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IOrderParams;
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  const order = await Order.findOne({ _id: id }).populate(POPULATE).exec();
  if (order == null) {
    json(res, 404, {
      message: "Invalid order id",
    });
    return
  }
  if (user.level != UserLevel.MANAGER && order.user._id != user._id)
    throw new Error("You don't own this order");
  else json(res, 200, shadow(order));
};

export const deleteOrder: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IOrderParams;
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  const order = await Order.findOne({ _id: id }).populate(POPULATE).exec();
  if (order == null) {
    json(res, 404, {
      message: "Invalid order id",
    });
    return;
  }
  if (user.level != UserLevel.MANAGER && order.user._id != user._id)
    throw new Error("You don't own this order");
  await order.delete();
  json(res, 200, null);
};
