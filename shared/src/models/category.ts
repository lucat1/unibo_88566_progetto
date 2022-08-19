import type { Document } from "mongoose";

export interface ISubcategory extends Document<number> {
  name: string;
  parent: ICategory;
}

export interface ICategory extends Document<number> {
  name: string;
  subcategories: ISubcategory[];
}
