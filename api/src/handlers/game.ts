import type { RequestHandler, Request } from "express";
// @ts-ignore
import send from "@polka/send-type";
import { z } from "zod";

import type { AuthenticatedRequest } from "../auth";
import { GameScore, GameType } from "../models/game-score";

export const GameParams = z.object({
  game: z.nativeEnum(GameType),
});
export type IGameParams = z.infer<typeof GameParams>;

export const GameQuery = z.object({
  id: z.string().optional(),
});
export type IGameQuery = z.infer<typeof GameQuery>;

const getPair = (req: Request): [string, string] => {
  const game = (req.params as IGameParams).game;
  let user: string;
  if ((req as AuthenticatedRequest).user)
    user = (req as AuthenticatedRequest).user!._id as string;
  else if ((req.query as IGameQuery).id) user = (req.query as IGameQuery).id!;
  else throw new Error("Missing both authentication and id query parameter");

  return [user, game];
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const GameBody = z.object({
  increment: z.number(),
});
export type IGameBody = z.infer<typeof GameBody>;

export const setScore: RequestHandler = async (req, res) => {
  const [user, game] = getPair(req);
  const { increment } = req.body as IGameBody;
  if (!UUID_REGEX.test(user))
    throw new Error("Invalid id, it must be a valid UUID");

  let score =
    (await GameScore.findOne({ user, game }).exec()) ||
    new GameScore({ user, game, score: 0 });

  score.score += increment;
  await score.save();
  send(res, 200, JSON.stringify(score), {
    "Content-Type": "application/json",
  });
};

export const getScore: RequestHandler = async (req, res) => {
  const [user, game] = getPair(req);
  const result = await GameScore.findOne({ user, game }).exec();
  if (result == null) throw new Error("Invalid (id,game) pair");
  else
    send(res, 200, JSON.stringify(result), {
      "Content-Type": "application/json",
    });
};
