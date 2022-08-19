import type { Document, ObjectId } from "mongoose";
import type { PaginateResult } from "mongoose";

export enum GameType {
  QUIZ = "quiz",
  MEMORY = "memory",
}

export interface IGameScore extends Document {
  user: ObjectId;
  username?: string;
  game: GameType;
  score: number;
}

export type IGameScorePaginated = PaginateResult<IGameScore>;
