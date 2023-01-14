import type { Document } from "mongoose";
import type { IService } from "./service";
import type { IUser } from "./user";

export interface IAppointment extends Document {
  customer: IUser;
  service: IService;
  calendar: string;
  minutes: number;
}
