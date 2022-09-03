import type { Document } from "mongoose";

export interface IStore extends Document {
  name: string;
  location: [number, number];
}
