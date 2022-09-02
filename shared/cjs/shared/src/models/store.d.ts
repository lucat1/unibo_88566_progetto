import type { Document } from "mongoose";
import type { IStock } from "./stock";
export interface IStore extends Document {
    name: string;
    online: boolean;
    location?: string;
    warehouse: IStock[];
}
