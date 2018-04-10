import { Document } from 'mongoose';

export interface IInventory extends Document {
  item: string,
  holder: string
}