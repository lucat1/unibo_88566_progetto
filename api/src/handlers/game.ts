import type { RequestHandler, Request } from "express";
import { z } from "zod";

import json from "../res";
import { GameType } from "shared/models/game-score";
import { GameScore, shadow } from "../models/game-score";
import { User  } from "../models/user";
import type { ObjectId } from "mongoose";
import type { AuthenticatedRequest } from "../auth";
import type { IPaginationQuery } from "./pagination";
import type { IUser } from "shared/models/user";

export const GameParams = z.object({
  game: z.nativeEnum(GameType),
});
export type IGameParams = z.infer<typeof GameParams>;

export const GameScoreQuery = z.object({
  id: z.string().uuid().optional(),
});
export type IGameScoreQuery = z.infer<typeof GameScoreQuery>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getPair = (req: Request): [string, string] => {
  const { game } = req.params as IGameParams;
  let user: string;
  if ((req as AuthenticatedRequest).user)
    user = (req as AuthenticatedRequest).user!._id as string;
  else if ((req.query as IGameScoreQuery).id)
    user = (req.query as IGameScoreQuery).id!;
  else throw new Error("Missing both authentication and id query parameter");

  if (!UUID_REGEX.test(user))
    throw new Error("Invalid id, it must be a valid UUID");

  return [user, game];
};

export const GameBody = z.object({
  score: z.number().min(1),
});
export type IGameBody = z.infer<typeof GameBody>;

export const setScore: RequestHandler = async (req, res) => {
  const [uuid, game] = getPair(req);
  let user: IUser & {_id: ObjectId}| null = null;
  try {
    user = await User.findOne({_id: uuid}).exec()
  } catch (_) {}
  const { score: value } = req.body as IGameBody;

  let score =
    (await GameScore.findOne({ user: uuid, game }).exec()) ||
    new GameScore({ user: uuid, username: user?.username, game, score: 0 });

  score.score += value;
  await score.save();
  json(res, 200, shadow(score));
};

export const getScore: RequestHandler = async (req, res) => {
  const [user, game] = getPair(req);

  let result = await GameScore.findOne({ user, game }).exec();
  if (result == null)
    await (result = new GameScore({ user, game, score: 0 })).save();

  json(res, 200, shadow(result));
};

export const getLeaderboard: RequestHandler = async (req, res) => {
  const { game } = req.params as IGameParams;
  const { limit, page } = req.query as unknown as IPaginationQuery;

  const result = await GameScore.paginate(
    { game },
    /* Sort by score descending */
    { limit, page, sort: { score: -1 } }
  );

  json(res, 200, { ...result, docs: result.docs.map(shadow) });
};
