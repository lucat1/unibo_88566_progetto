import type { Document } from "mongoose";
import type { ICategory, ISubcategory } from "./category";

export interface IPet extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  photos: string[];

  category: ICategory;
  subcategory?: ISubcategory;
}
