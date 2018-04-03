import { Document } from 'mongoose';

export interface ICategory extends Document {
  dbname: string,
  category: string
}