import type { Document } from "mongoose";
import type { ICategory, ISubcategory } from "./category";

export interface IPet extends Document {
  name: string;
  description: string;
  photos: string[];
  price: number;

  category: ICategory;
  subcategory?: ISubcategory;
}
