/// <reference types="mongoose-paginate" />
import type { Document, ObjectId } from "mongoose";
import type { PaginateResult } from "mongoose";
export declare enum GameType {
    QUIZ = "quiz",
    MEMORY = "memory",
    HANGMAN = "hangman"
}
export interface IGameScore extends Document {
    user: ObjectId;
    username?: string;
    game: GameType;
    score: number;
}
export declare type IGameScorePaginated = PaginateResult<IGameScore>;
