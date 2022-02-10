import mongoose from "mongoose";
import { generateId } from "../util";

export interface IItem {
  _id: Buffer;
  tagId: Buffer;
  name: string;
  description: string;
  image?: Buffer;
  price: number;
}

export const ItemSchema = new mongoose.Schema<IItem>({
  _id: {
    type: Buffer.alloc(0),
    default() {
      return generateId();
    },
  },
  tagId: {
    type: Buffer.alloc(0),
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: Buffer.alloc(0),
  },
  price: {
    type: Number,
    required: true,
  },
});

export const ItemModel = mongoose.model("Item", ItemSchema);
