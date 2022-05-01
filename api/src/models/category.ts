import { Schema, Document, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc-fix";

export interface ISubcategory extends Document<number> {
  name: string;
  parent: ICategory;
}

export interface ICategory extends Document<number> {
  name: string;
  subcategories: ISubcategory[];
}

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
