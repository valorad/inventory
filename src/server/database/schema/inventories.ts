import { model, Schema } from 'mongoose';

import { IInventory } from "../interface/inventory.interface";

const schema = new Schema({
  item: {
    type: String,
    required: true
  },
  holder: {
    type: String,
    required: true
  }
});

export const inventories = model<IInventory>('inventories', schema, "inventories");