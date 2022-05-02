import { Schema, Document, model, PaginateModel, ObjectId } from "mongoose";
import paginate from "mongoose-paginate";

export enum GameType {
  QUIZ = "quiz",
}

export interface IGameScore extends Document {
  user: ObjectId;
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
/* Enable pagination for this schema */
GameScoreSchema.plugin(paginate);

export const GameScore: PaginateModel<IGameScore> = model<IGameScore>(
  "GameScore",
  GameScoreSchema
) as PaginateModel<IGameScore>;

export const shadow = ({ _id, user, game, score }: IGameScore) => ({
  _id,
  user,
  game,
  score,
});
