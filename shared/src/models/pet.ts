import type { Document } from "mongoose";
import type { ICategory, ISubcategory } from "./category";
import type { IUser } from "./user";

/* TODO: tags */
export interface IPet extends Document {
  name: string;
  photos: string[];

  category: ICategory;
  subcategory?: ISubcategory;
  owner?: IUser;
}
