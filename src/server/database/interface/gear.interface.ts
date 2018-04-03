import { Document } from 'mongoose';

import { IEffect } from "./effect.interface";

export interface IGear extends Document {
  dbname: string,
  rating: number,
  type: string,
  equip: string,
  effects: IEffect[]
}