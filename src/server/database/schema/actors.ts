import { model, Schema } from 'mongoose';

import { IActor, IEquiped } from "../interface/actor.interface";
import { ObjectId } from 'bson';

const schema = new Schema({
  dbname: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  },
  equiped: {

    type: {

      head: {
        type: ObjectId,
        required: false
      },
      face: {
        type: ObjectId,
        required: false
      },
      neck: {
        type: ObjectId,
        required: false
      },
      body: {
        type: ObjectId,
        required: false
      },
      back: {
        type: ObjectId,
        required: false
      },
      forearms: {
        type: ObjectId,
        required: false
      },
      lefthand: {
        type: ObjectId,
        required: false
      },
      righthand: {
        type: ObjectId,
        required: false
      },
      bothhands: {
        type: ObjectId,
        required: false
      },
      finger: {
        type: ObjectId,
        required: false
      },
      feet: {
        type: ObjectId,
        required: false
      }
      
    },

    required: true
  }
});

export const actors = model<IActor>('actors', schema, "actors");