import { Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc-fix";
import type { ICategory, ISubcategory } from "shared/models/category";

const SubcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  parent: { type: Number, ref: "Category" },
});
SubcategorySchema.plugin(autoIncrement, "Subcategory");

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  subcategories: [{ type: Number, ref: "Subcategory" }],
});
CategorySchema.plugin(autoIncrement, "Category");

export const Subcategory = model<ISubcategory>(
  "Subcategory",
  SubcategorySchema
);

export const Category = model<ICategory>("Category", CategorySchema);

export const shadowSubcategory = ({ _id, name, parent }: ISubcategory) => ({
  _id,
  name,
  parent: typeof parent == "number" ? parent : parent._id,
});
export const shadowCategory = ({ _id, name }: ICategory) => ({ _id, name });
