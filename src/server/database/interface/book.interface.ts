import { Document } from 'mongoose';

export interface IBook extends Document {
  dbname: string,
  content?: string
}