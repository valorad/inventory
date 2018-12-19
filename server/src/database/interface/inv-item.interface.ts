import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IInvItem extends Document {
  item: string,
  holder: string,
  refs: ObjectId[]
}