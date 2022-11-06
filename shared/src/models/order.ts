import type { Document } from "mongoose";
import type { IProduct } from "./product";
import type { IUser } from "./user";

export interface IOrder extends Document {
  items: IItem[]
  user: IUser
}

export interface IItem {
  product: IProduct
  amount: number
}
