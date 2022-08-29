import type { RequestHandler } from "express";
import { z } from "zod";
import sharp from "sharp";
import { v4 } from "node-uuid";
import { join } from "path";
import mkdirp from "mkdirp";
import { stat } from "fs/promises";
import { createReadStream } from "fs";

import json from "../res";
const dir = join(__dirname, "..", "..", "images");

export const ImageParams = z.object({
  id: z.string().uuid(),
});
export type IImageParams = z.infer<typeof ImageParams>;
export const ImageQuery = z.object({
  quality: z
    .number()
    .positive()
    .max(100)
    .min(0)
    .optional()
    .default(80)
    .or(z.string().regex(/^\d+$/).transform(Number)),
});
export type IImageQuery = z.infer<typeof ImageQuery>;

export const serve: RequestHandler = async (req, res) => {
  const { id } = req.params as IImageParams;
  let size = 0;
  const path = join(dir, id);
  try {
    const { size: s } = await stat(path);
    size = s;
  } catch (_) {
    json(res, 404, { message: "Not Found" });
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Length", size);
  res.setHeader("Content-Type", "image/webp");
  createReadStream(path).pipe(res);
};

export const upload: RequestHandler = async (req, res) => {
  const { quality } = req.query as unknown as IImageQuery;
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const image = Buffer.concat(buffers);
  await mkdirp(dir);
  const id = v4();
  const path = join(dir, id);
  await sharp(image).webp({ lossless: true, quality }).toFile(path);

  json(res, 200, { id });
};
