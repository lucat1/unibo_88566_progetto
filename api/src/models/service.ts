import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IInterval, ICalendar, IService } from "shared/models/service";

const IntervalSchema = new Schema<IInterval>({
  dayOfWeek: { type: Number, required: true },
  from: [Number],
  to: [Number],
});

const CalendarSchema = new Schema<ICalendar>({
  name: String,
  intervals: [IntervalSchema],
  slotDuration: Number,
});

const ServiceSchema = new Schema<IService>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  photos: [String],
  store: { type: String, ref: "Store" },
  disponibilities: [CalendarSchema],
});
ServiceSchema.plugin(paginate);

export const Service: PaginateModel<IService> = model<IService>(
  "Service",
  ServiceSchema
) as PaginateModel<IService>;

export const shadow = ({
  _id,
  name,
  description,
  price,
  photos,
  store,
  disponibilities,
}: IService) => ({
  _id,
  name,
  description,
  price,
  photos,
  store,
  disponibilities,
});
