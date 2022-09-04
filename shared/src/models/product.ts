import type { Document } from "mongoose";
import type { ICategory, ISubcategory } from "./category";

/* TODO: tags */
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  photos: string[];

  category?: ICategory;
  subcategory?: ISubcategory;
}
