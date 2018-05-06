import { model, Schema } from 'mongoose';

import { IInvItem } from "../interface/inv-item.interface";

const schema = new Schema({
  item: {
    type: String,
    required: true
  },
  holder: {
    type: String,
    required: true
  },
  refs: {
    type: [Schema.Types.ObjectId],
    default: []
  }
});

export const invItems = model<IInvItem>('invItems', schema, "invItems");