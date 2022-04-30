import { Schema, Document, model } from "mongoose";
import { v4 } from "node-uuid";
import type { ICategory, ISubcategory } from "./category";
import type { IUser } from "./user";

export interface IPet extends Document {
  name: string;
  photos: string[];

  category: ICategory;
  subcategory?: ISubcategory;
  owner?: IUser;
}

const PetSchema = new Schema<IPet>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  photos: [String],

  category: { type: Number, ref: "Category", required: true },
  subcategory: { type: Number, ref: "Subcategory" },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Pet = model<IPet>("User", PetSchema);
