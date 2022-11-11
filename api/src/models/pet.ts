import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IPet } from "shared/models/pet";
import { shadowCategory, shadowSubcategory } from "./category";
import type { ICategory, ISubcategory } from "shared/models/category";

const PetSchema = new Schema<IPet>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  description: { type: String, required: true },
  photos: [String],
  price: { type: Number },

  category: { type: Number, ref: "Category", required: true },
  subcategory: { type: Number, ref: "Subcategory" },
});
PetSchema.plugin(paginate);

export const Pet: PaginateModel<IPet> = model<IPet>(
  "Pet",
  PetSchema
) as PaginateModel<IPet>;

export const shadow = ({ _id, name, description, photos, price, category, subcategory }: IPet) => ({
  _id,
  name,
  description,
  photos,
  price,
  category:
    typeof category == "undefined"
      ? undefined
      : typeof category == "number"
        ? { _id: category }
        : shadowCategory(category as ICategory),
  subcategory:
    typeof subcategory == "undefined"
      ? undefined
      : typeof subcategory == "number"
        ? { _id: subcategory }
        : shadowSubcategory(subcategory as ISubcategory),
});
