import { model, Schema } from 'mongoose';

import { IRefItem } from "../interface/ref-item.interface";

const schema = new Schema({
  item: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: false
  },
  num: {
    type: Number,
    default: 1,
    min: 1
  }
});

export const refItems = model<IRefItem>('refItems', schema, "refItems");