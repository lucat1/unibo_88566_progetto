import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IPet } from "shared/models/pet";

const PetSchema = new Schema<IPet>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  description: { type: String, required: true },
  photos: [String],

  category: { type: Number, ref: "Category", required: true },
  subcategory: { type: Number, ref: "Subcategory" },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});
PetSchema.plugin(paginate);

export const Pet: PaginateModel<IPet> = model<IPet>(
  "Pet",
  PetSchema
) as PaginateModel<IPet>;

export const shadow = ({ _id, name, photos, category, subcategory }: IPet) => ({
  _id,
  name,
  photos,
  category: typeof category == "number" ? category : category._id,
  subcategory: typeof subcategory == "number" ? subcategory : subcategory?._id,
});
