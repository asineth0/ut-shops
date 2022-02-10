import mongoose from "mongoose";
import { generateId } from "../util";

export interface ITag {
  _id: Buffer;
  shopId: Buffer;
  name: string;
  variations: string[];
}

export const TagSchema = new mongoose.Schema<ITag>({
  _id: {
    type: Buffer.alloc(0),
    default() {
      return generateId();
    },
  },
  name: {
    type: String,
    required: true,
  },
  variations: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    required: true,
  },
});

export const TagModel = mongoose.model<ITag>("Tag", TagSchema);
