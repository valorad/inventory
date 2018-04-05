import { Document } from 'mongoose';

export interface IActor extends Document {
  dbname: string,
  icon?: string,
  equiped?: any
}