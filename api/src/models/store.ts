import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IStore } from "shared/models/store";

const StoreSchema = new Schema<IStore>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  location: [
    { type: Number, required: true },
    { type: Number, required: true },
  ],
});
StoreSchema.plugin(paginate);

export const Store: PaginateModel<IStore> = model<IStore>(
  "Store",
  StoreSchema
) as PaginateModel<IStore>;

export const shadow = ({ _id, name, location }: IStore) => ({
  _id,
  name,
  location,
});
