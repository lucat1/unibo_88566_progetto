import { Schema, model } from "mongoose";

export enum GameType {
  QUIZ = "quiz",
}

export interface IGameScore {
  user: string;
  game: GameType;
  score: number;
}

const GameScoreSchema = new Schema<IGameScore>({
  user: { type: String, required: true },
  game: {
    type: String,
    required: true,
    enum: [GameType.QUIZ],
  },
  score: { type: Number, required: true },
});
/* The triple (user,game,score) has to be unique */
GameScoreSchema.index({ user: 1, game: 1, score: 1 }, { unique: true });

export const GameScore = model<IGameScore>("GameScore", GameScoreSchema);
