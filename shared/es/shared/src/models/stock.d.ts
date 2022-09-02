import type { Document } from "mongoose";
import type { IProduct } from "./product";
import type { IStore } from "./store";
export interface IStock extends Document {
    product: IProduct;
    store: IStore;
    online: boolean;
    quantity: number;
}
