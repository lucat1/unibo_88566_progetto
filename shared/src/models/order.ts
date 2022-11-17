import type { Document } from "mongoose";
import type { IProduct } from "./product";
import type { IUser } from "./user";

export interface IOrder extends Document {
  items: IItem[];
  user: IUser;
  shipping: IShipping;
}

export interface IItem {
  product: IProduct;
  amount: number;
}

export interface IShipping {
  firstName: string;
  lastName: string;
  address: string;
  phone: number;
}
