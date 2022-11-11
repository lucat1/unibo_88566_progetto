import type { RequestHandler } from "express";
import { z } from "zod";

import json from "../res";
import { Pet, shadow } from "../models/pet";
import type { IPaginationQuery, ISortingQuery } from "./pagination";

const POPULATE = ["category", "subcategory"];

export const PetBody = z.object({
  name: z.string().min(1),
  description: z.string().min(1),

  category: z.number(),
  subcategory: z.number().optional(),
  owner: z.string().uuid().optional(),
});
export type IPetBody = z.infer<typeof PetBody>;

export const addPet: RequestHandler = async (req, res) => {
  const data = req.body as IPetBody;
  const pet = new Pet(data);
  await pet.save();
  json(res, 200, shadow(pet));
};

export const getPets: RequestHandler = async (req, res) => {
  const { limit, page, sort, order } =
    req.query as unknown as IPaginationQuery & ISortingQuery;

  const result = await Pet.paginate(
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

export const PetParams = z.object({
  id: z.string().uuid(),
});
export type IPetParams = z.infer<typeof PetParams>;

export const getPet: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IPetParams;
  const pet = await Pet.findOne({ _id: id }).populate(POPULATE).exec();
  if (pet == null)
    json(res, 404, {
      message: "Invalid pet id",
    });
  else json(res, 200, shadow(pet));
};

export const deletePet: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IPetParams;
  await Pet.deleteOne({ _id: id });
  json(res, 200, null);
};

export const setPet: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as IPetParams;
  const patch = req.body as IPetBody;
  const updated = await Pet.findOneAndUpdate({ _id: id }, patch, {
    new: true,
  }).exec();
  if (updated == null)
    json(res, 404, {
      message: "Invalid pet id",
    });
  else json(res, 200, shadow(updated));
};
