import type { Document, ObjectId } from "mongoose";
import type { PaginateResult } from "mongoose";

export enum GameType {
  QUIZ = "quiz",
}

export interface IGameScore extends Document {
  user: ObjectId;
  game: GameType;
  score: number;
}

export type IGameScorePaginated = PaginateResult<IGameScore>
