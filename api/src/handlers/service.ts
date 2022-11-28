import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Service, shadow } from "../models/service";
import type { IPaginationQuery, ISortingQuery } from "./pagination";

export const ServiceBody = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
  price: z.number(),
  photos: z.array(z.string()).optional().default([]),
  // TODO: disponibilities
});
export type IServiceBody = z.infer<typeof ServiceBody>;

export const addService: RequestHandler = async (req, res) => {
  const data = req.body as IServiceBody;
  const service = new Service(data);
  await service.save();
  json(res, 200, shadow(service));
};

export const getServices: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;

  const result = await Service.paginate(
    {},
    {
      limit,
      page,
      sort: sort ? { [sort]: order } : {},
    }
  );

  json(res, 200, { ...result, docs: result.docs.map(shadow) });
};

export const ServiceRandomParams = z.object({
  length: z.number().int().positive().default(4),
});
export type IServiceRandomParams = z.infer<typeof ServiceRandomParams>;

export const getRandomServices: RequestHandler = async (req, res) => {
  const services = await Service.find().exec();
  let { length } = req.query as unknown as IServiceRandomParams;
  length = Math.min(length, services.length);
  for (let i = 0; i < length; ++i) {
    const j = i + Math.floor(Math.random() * length - i),
      t = services[i];
    services[i] = services[j];
    services[j] = t;
  }
  json(res, 200, services.slice(0, length).map(shadow));
};

export const ServiceParams = z.object({
  id: z.string().uuid(),
});
export type IServiceParams = z.infer<typeof ServiceParams>;

export const getService: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IServiceParams;
  const service = await Service.findOne({ _id: id }).exec();
  if (service == null)
    json(res, 404, {
      message: "Invalid service id",
    });
  else json(res, 200, shadow(service));
};

export const deleteService: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IServiceParams;
  await Service.deleteOne({ _id: id });
  json(res, 200, null);
};

export const setService: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IServiceParams;
  const patch = req.body as IServiceBody;
  const updated = await Service.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid service id",
    });
  else json(res, 200, shadow(updated));
};
