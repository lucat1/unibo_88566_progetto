import { Schema, Document, model } from "mongoose";

export interface ISubcategory extends Document<number> {
  name: string;
  parent: ICategory;
}

export interface ICategory extends Document<number> {
  name: string;
  subcategories: ISubcategory[];
}

const SubcategorySchema = new Schema<ISubcategory>({
  _id: { type: Number },
  name: { String, required: true },
  parent: { type: Number, ref: "Category" },
});

const CategorySchema = new Schema<ICategory>({
  _id: { type: Number },
  name: { String, required: true },
  subcategories: [{ type: Number, ref: "Subcategory" }],
});

export const Subcategory = model<ISubcategory>(
  "Subcategory",
  SubcategorySchema
);

export const Category = model<ICategory>("Category", CategorySchema);
