import { model, Schema } from 'mongoose';

import { IActor } from "../interface/actor.interface";

const schema = new Schema({
  dbname: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    required: false
  },
  equiped: {
    type: {},
    default: {}
  }
});

export const actors = model<IActor>('actors', schema, "actors");