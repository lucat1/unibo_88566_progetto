import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IOrder, IItem, IShipping } from "shared/models/order";
import { shadow as shadowProduct } from "./product";

const ItemSchema = new Schema<IItem>({
  product: { type: String, ref: "Product" },
  amount: { type: Number }
})

const ShippingSchema = new Schema<IShipping>({
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phone: { type: Number },
})

const OrderSchema = new Schema<IOrder>({
  _id: { type: String, default: v4 },
  items: [{ type: ItemSchema }],
  user: { type: String, ref: "User" },
  shipping: { type: ShippingSchema }
});
OrderSchema.plugin(paginate);

export const Order: PaginateModel<IOrder> = model<IOrder>(
  "Order",
  OrderSchema
) as PaginateModel<IOrder>;

export const shadow = ({
  _id,
  items,
  user
}: IOrder) => ({
  _id,
  items: items.map(({ amount, product }) => ({ product: shadowProduct(product), amount })),
  user,
});
