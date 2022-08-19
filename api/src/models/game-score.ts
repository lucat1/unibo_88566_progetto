import { Schema, model, PaginateModel } from "mongoose";
import paginate from "mongoose-paginate";
import { IGameScore, GameType } from "shared/models/game-score";

const GameScoreSchema = new Schema<IGameScore>({
  user: { type: String, required: true },
  username: String,
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

export const shadow = ({ _id, user, username, game, score }: IGameScore) => ({
  _id,
  user,
  username,
  game,
  score,
});
