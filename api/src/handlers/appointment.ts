import type { RequestHandler } from "express";
import { z } from "zod";
import { UserLevel } from "shared/models/user";
import { Types } from "mongoose";

import json from "../res";
import { Appointment, shadow } from "../models/appointment";
import { User } from "../models/user";
import type { AuthenticatedRequest } from "../auth";
import type { IPaginationQuery, ISortingQuery } from "./pagination";

const POPULATE = ["customer", "service"];

export const AppointmentBody = z.object({
  service: z.string(),
  calendar: z.string(),
  from: z.string(),
});
export type IAppointmentBody = z.infer<typeof AppointmentBody>;

export const addAppointment: RequestHandler = async (req, res) => {
  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  const data = req.body as IAppointmentBody;
  const appointment = new Appointment({
    customer: user._id,
    service: data.service,
    calendar: data.calendar,
    minutes: data.from,
  });
  await appointment.save();
  json(res, 200, shadow(appointment));
};

export const AppointmentQuery = z.object({
  service: z.string().optional(),
  mine: z.string().optional(),
});
export type IAppointmentQuery = z.infer<typeof AppointmentQuery>;

export const getAppointments: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery &
      ISortingQuery &
      IAppointmentQuery;

  const user = await User.findOne((req as AuthenticatedRequest).user).exec();
  if (user == null) throw new Error("User not found");
  const query: any = {};
  if (req.query.onlyMe) query["customer"] = { _id: user._id };
  if (req.query.service)
    query["service"] = {
      _id: req.query.service,
    };
  const result = await Appointment.paginate(query, {
    limit,
    page,
    sort: sort ? { [sort]: order } : {},
    populate: POPULATE,
  });
  json(res, 200, { ...result, docs: result.docs.map(shadow) });
};

export const AppointmentParams = z.object({
  id: z.string(),
});
export type IAppointmentParams = z.infer<typeof AppointmentParams>;

export const deleteAppointment: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IAppointmentParams;
  await Appointment.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  json(res, 200, null);
};
