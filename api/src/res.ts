import type { Response } from "express";
// @ts-ignore
import send from "@polka/send-type";

const json = (res: Response, code: number, data: Object | null) =>
  send(res, code, JSON.stringify(data), {
    "Content-Type": "application/json",
  });

export default json;
