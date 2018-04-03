import { model, Schema } from 'mongoose';

import { IRefItem } from "../interface/ref-item.interface";

const schema = new Schema({
  dbname: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: false
  },
  num: {
    type: Number,
    default: 0
  }
});

export const refItems = model<IRefItem>('refItems', schema, "refItems");