import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Appointment, shadow } from "../models/appointment";
import type { IPaginationQuery, ISortingQuery } from "./pagination";

const POPULATE = ["customer", "service"];

export const AppointmentBody = z.object({
  service: z.string().uuid(),
  calendar: z.string(),
  from: z.string(),
});
export type IAppointmentBody = z.infer<typeof AppointmentBody>;

export const addAppointment: RequestHandler = async (req, res) => {
  const data = req.body as IAppointmentBody;
  const appointment = new Appointment(data);
  await appointment.save();
  json(res, 200, shadow(appointment));
};

export const getAppointments: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;

  const result = await Appointment.paginate(
    {},
    {
      limit,
      page,
      sort: sort ? { [sort]: order } : {},
      populate: POPULATE,
    }
  );

  json(res, 200, { ...result, docs: result.docs.map(shadow) });
};

export const AppointmentParams = z.object({
  id: z.string().uuid(),
  service: z.string().uuid().optional(),
});
export type IAppointmentParams = z.infer<typeof AppointmentParams>;

export const deleteAppointment: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IAppointmentParams;
  await Appointment.deleteOne({ _id: id }).exec();
  json(res, 200, null);
};
