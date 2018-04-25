import { Document } from 'mongoose';
import { ObjectId } from 'bson';

export interface IInvItem extends Document {
  item: string,
  holder: string,
  refs: ObjectId[]
}