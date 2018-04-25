import { Document } from 'mongoose';

export interface IGear extends Document {
  dbname: string,
  rating: number,
  type: string,
  equip: string[],
  effects: string[]
}