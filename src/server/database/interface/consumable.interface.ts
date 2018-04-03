import { Document } from 'mongoose';

export interface IConsumable extends Document {
  dbname: string,
  type: string,
  effects: any[]
}