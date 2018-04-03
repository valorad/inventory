import { Document } from 'mongoose';

export interface IRefItem extends Document {
  dbname: string,
  owner?: string,
  num?: number
}