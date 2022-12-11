import type { Document } from "mongoose";
import type { IStore } from "./store";

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  photos: string[];
  store: IStore;
  disponibilities: string[];
}
