import { Schema, Document, model } from "mongoose";
import { v4 } from "node-uuid";
import type { IStock } from "shared/models/stock";

const StockSchema = new Schema<IStock>({
  _id: { type: String, default: v4 },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  store: { type: Schema.Types.ObjectId, ref: "Store" },
  online: { type: Boolean, default: false },
  quantity: { type: Number, default: 0 },
});

export const Stock = model<IStock>("Stock", StockSchema);

export const shadow = ({ _id, product, store, online, quantity }: IStock) => ({
  _id,
  product: typeof product == "number" ? product : product._id,
  store: typeof store == "number" ? store : store._id,
  online,
  quantity,
});
