import { Schema, PaginateModel, model } from "mongoose";
import paginate from "mongoose-paginate";
import { v4 } from "node-uuid";
import type { IAppointment } from "shared/models/appointment";
import { shadow as shadowService } from "./service";
import { shadow as shadowUser } from "./user";

const AppointmentSchema = new Schema<IAppointment>({
  _id: { type: String, default: v4 },
  customer: { type: String, ref: "User", required: true },
  service: { type: String, ref: "Service", required: true },
  calendar: { type: String, required: true },
  minutes: { type: Date, required: true },
});
AppointmentSchema.plugin(paginate);

export const Appointment: PaginateModel<IAppointment> = model<IAppointment>(
  "Appointment",
  AppointmentSchema
) as PaginateModel<IAppointment>;

export const shadow = ({
  _id,
  customer,
  service,
  calendar,
  minutes,
}: IAppointment) => ({
  _id,
  customer: shadowUser(customer),
  service: shadowService(service),
  calendar,
  minutes,
});
