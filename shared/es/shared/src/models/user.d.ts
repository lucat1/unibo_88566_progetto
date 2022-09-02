import type { Document } from "mongoose";
import type { IPet } from "./pet";
export declare enum UserLevel {
    BASIC = 0,
    VIP = 1,
    MANAGER = 2
}
export interface IUser extends Document {
    username: string;
    password: string;
    level: UserLevel;
    firstName: string;
    lastName?: string;
    city?: string;
    avatar?: string;
    pets: IPet[];
}
