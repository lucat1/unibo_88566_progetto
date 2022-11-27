import type { Document } from "mongoose";
import type { IPet } from "./pet";
import type { IProduct } from "./product";
import type { IUser } from "./user";

export interface IOrder extends Document {
  items: IItem[];
  user: IUser;
  shipping: IShipping;
  date: Date;
}

export interface IItem {
  product: IProduct | null;
  pet: IPet | null;
  amount: number;
}

export interface IShipping {
  firstName: string;
  lastName: string;
  address: string;
  phone: number;
}
