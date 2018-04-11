import { Document } from 'mongoose';

export interface IBaseItem extends Document {
  dbname: string,
  category: string,
  weight: number,
  value: number
}