import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IOrder, IItem, IShipping } from "shared/models/order";
import { shadow as shadowProduct } from "./product";
import { shadow as shadowPet } from "./pet";
import { shadow as shadowUser } from "./user";

const ItemSchema = new Schema<IItem>({
  product: { type: String, ref: "Product" },
  pet: { type: String, ref: "Pet" },
  amount: { type: Number, required: true },
});

const ShippingSchema = new Schema<IShipping>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
  _id: { type: String, default: v4 },
  items: [{ type: ItemSchema }],
  user: { type: String, ref: "User", required: true },
  date: { type: Date, required: true },
  shipping: { type: ShippingSchema, required: true },
});
OrderSchema.plugin(paginate);

export const Order: PaginateModel<IOrder> = model<IOrder>(
  "Order",
  OrderSchema
) as PaginateModel<IOrder>;

export const shadow = ({ _id, items, user, shipping, date }: IOrder) => ({
  _id,
  items: items.map(({ amount, product, pet }) => ({
    product: product ? shadowProduct(product) : null,
    pet: pet ? shadowPet(pet) : null,
    amount,
  })),
  user: shadowUser(user),
  date,
  shipping
});
