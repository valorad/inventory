import { model, Schema } from 'mongoose';

import { IGear } from "../interface/gear.interface";

const schema = new Schema({
  dbname: {
    type: String,
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    required: true
  },
  equip: {
    type: String,
    required: true
  },
  effects: {
    type: [],
    required: true
  }
});

export const gears = model<IGear>('gears', schema, "gears");