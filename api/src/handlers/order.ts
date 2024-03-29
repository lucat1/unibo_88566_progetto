import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Order, shadow } from "../models/order";
import { User } from "../models/user";
import { Product } from "../models/product";
import { Pet } from "../models/pet";
import type { AuthenticatedRequest } from "../auth";
import type { IPaginationQuery, ISortingQuery } from "./pagination";
import { UserLevel } from "shared/models/user";
import type { Document } from "mongoose";
const POPULATE = ["items.product", "items.pet", "user"];

export const ItemBody = z.object({
  product: z.string().nullable(),
  pet: z.string().nullable(),
  amount: z.number().min(1),
});
export type IItemBody = z.infer<typeof ItemBody>;
export const ShippingBody = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  phone: z.number(),
});
export type IShippingBody = z.infer<typeof ShippingBody>;
export const OrderBody = z.object({
  items: z.array(ItemBody),
  shipping: ShippingBody,
});
export type IOrderBody = z.infer<typeof OrderBody>;

export const addOrder: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  const data = req.body as IOrderBody;
  if (
    data.items.some(
      (i) =>
        (i.product == null && i.pet == null) ||
        (i.product != null && i.pet != null)
    )
  )
    throw new Error("All items must one and only one product/pet");

  // check enough stock is available
  for (const item of data.items) {
    let i: ({ name: number; stock: number } & Document) | null;
    if (item.product) {
      // product
      i = (await Product.findOne({ _id: item.product }).exec()) as any;
    } else {
      // pet
      i = (await Pet.findOne({ _id: item.pet }).exec()) as any;
    }

    if (!i || i.stock < item.amount) {
      json(res, 400, {
        message: i ? "Not enough stock of: " + i.name : "Unkown pet/product",
        error: null,
      });
      return;
    } else {
      i.stock -= item.amount;
      await i.save();
    }
  }

  const order = new Order({ ...data, date: new Date(), user: user._id });
  await order.save();
  json(res, 200, shadow(order));
};

export const getOrders: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;
  const { user } = req as AuthenticatedRequest;

  let query = {};
  if ((user!.level || 0) < 1) query = { user: user!._id };

  const result = await Order.paginate(query, {
    limit,
    page,
    sort: sort ? { [sort]: order } : {},
    populate: POPULATE,
  });

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
    return;
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
  for (const item of order.items) {
    let i: ({ name: number; stock: number } & Document) | null;
    if (item.product) {
      // product
      i = (await Product.findOne({ _id: item.product }).exec()) as any;
    } else {
      // pet
      i = (await Pet.findOne({ _id: item.pet }).exec()) as any;
    }

    if (i == null)
      // The order had a deleted item
      continue;

    i.stock += item.amount;
    await i.save();
  }

  if (user.level != UserLevel.MANAGER && order.user._id != user._id)
    throw new Error("You don't own this order");
  await order.delete();
  json(res, 200, null);
};
