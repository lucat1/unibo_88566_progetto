import type { Document } from "mongoose";
import type { ICategory, ISubcategory } from "./category";
import type { IUser } from "./user";

export interface IPet extends Document {
  name: string;
  description: string;
  photos: string[];

  category: ICategory;
  subcategory?: ISubcategory;
  owner?: IUser;
}
