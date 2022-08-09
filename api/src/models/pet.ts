import { Schema, model } from "mongoose";
import { v4 } from "node-uuid";
import { IPet } from "shared/models/pet";

const PetSchema = new Schema<IPet>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  photos: [String],

  category: { type: Number, ref: "Category", required: true },
  subcategory: { type: Number, ref: "Subcategory" },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Pet = model<IPet>("User", PetSchema);

export const shadow = ({ _id, name, photos, category, subcategory }: IPet) => ({
  _id,
  name,
  photos,
  category: typeof category == "number" ? category : category._id,
  subcategory: typeof subcategory == "number" ? subcategory : subcategory?._id,
});
