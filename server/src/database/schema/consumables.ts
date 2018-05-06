import { model, Schema } from 'mongoose';

import { IConsumable } from "../interface/consumable.interface";

const schema = new Schema({
  dbname: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  effects: {
    type: [],
    required: true
  }
});

export const consumables = model<IConsumable>('consumables', schema, "consumables");