import { Document } from 'mongoose';

export interface IEffect extends Document {
  dbname: string
}