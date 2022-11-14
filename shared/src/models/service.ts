import type { Document } from "mongoose";

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  photos: string[];
  // TODO: disponibilities
}
