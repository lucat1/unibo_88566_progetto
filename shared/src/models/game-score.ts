import type { Document, ObjectId } from "mongoose";

export enum GameType {
  QUIZ = "quiz",
}

export interface IGameScore extends Document {
  user: ObjectId;
  game: GameType;
  score: number;
}
