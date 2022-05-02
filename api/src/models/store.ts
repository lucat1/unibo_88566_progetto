import { Schema, Document, model } from "mongoose";
import { v4 } from "node-uuid";
import type { IStock } from "./stock";

export interface IStore extends Document {
  name: string;
  online: boolean;
  location?: string;

  warehouse: IStock[];
}

const StoreSchema = new Schema<IStore>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  location: { type: String },
  warehouse: [{ type: Schema.Types.ObjectId, ref: "Stock" }]
});

export const Store = model<IStore>("Store", StoreSchema);

export const shadow = ({ _id, name, online, location }: IStore) => ({
  _id,
  name,
  online,
  location,
});
