import { model, Schema } from 'mongoose';

import { IBaseItem } from "../interface/base-item.interface";

const schema = new Schema({
  dbname: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    default: 0,
    min: 0
  },
  value: {
    type: Number,
    default: 0
  }
});

export const baseItems = model<IBaseItem>('baseItems', schema, "baseItems");