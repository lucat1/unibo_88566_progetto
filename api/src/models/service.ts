import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IService } from "shared/models/service";

const ServiceSchema = new Schema<IService>({
  _id: { type: String, default: v4 },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  photos: [String],
  // TODO: disponibilities
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
}: IService) => ({
  _id,
  name,
  description,
  price,
  photos,
});
