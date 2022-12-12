import type { Document } from "mongoose";
import type { IStore } from "./store";

export interface IInterval extends Document {
  dayOfWeek: number;
  from: [number, number?, number?];
  to: [number, number?, number?];
}

export interface ICalendar extends Document {
  name: string;
  intervals: IInterval[];
  slotDuration: number;
}

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  photos: string[];
  store: IStore;
  disponibilities: ICalendar[];
}
