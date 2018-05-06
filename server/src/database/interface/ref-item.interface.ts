import { Document } from 'mongoose';

export interface IRefItem extends Document {
  item: string,
  owner?: string,
  num: number
}