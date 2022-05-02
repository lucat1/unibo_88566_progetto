import { Schema, Document, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { ICategory, ISubcategory } from "./category";
import type { IStock } from "./stock";

/* TODO: tags */
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  photos: string[]; 
  stocks: IStock[];

  category?: ICategory;
  subcategory?: ISubcategory;
}

const ProductSchema = new Schema<IProduct>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  photos: [String],
  stocks: [{ type: Schema.Types.ObjectId, ref: "Stock" }],

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
  photos,
  category,
  subcategory,
}: IProduct) => ({
  _id,
  name,
  description,
  price,
  photos,
  category: typeof category == "number" ? category : category?._id,
  subcategory: typeof subcategory == "number" ? subcategory : subcategory?._id,
});
