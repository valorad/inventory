import { model, Schema } from 'mongoose';

import { IEffect } from "../interface/effect.interface";

const schema = new Schema({
  dbname: {
    type: String,
    required: true,
    unique: true
  }
});

export const effects = model<IEffect>('effects', schema, "effects");