import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IProduct } from "shared/models/product";
import { shadowCategory, shadowSubcategory } from "./category";
import type { ICategory, ISubcategory } from "shared/models/category";

const ProductSchema = new Schema<IProduct>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  photos: [String],

  category: { type: Number, ref: "Category" },
  subcategory: { type: Number, ref: "Subcategory" },
});
ProductSchema.plugin(paginate);

export const Product: PaginateModel<IProduct> = model<IProduct>(
  "Product",
  ProductSchema
) as PaginateModel<IProduct>;

export const shadow = ({
  _id,
  name,
  description,
  price,
  stock,
  photos,
  category,
  subcategory,
}: IProduct) => ({
  _id,
  name,
  description,
  price,
  stock,
  photos,
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
