import { Document } from 'mongoose';
import { ObjectId } from 'bson';

export interface IInventory extends Document {
  item: string,
  holder: string,
  refs: ObjectId[]
}