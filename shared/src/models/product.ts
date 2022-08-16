import type { Document } from "mongoose";
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
