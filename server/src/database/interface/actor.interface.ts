import { Document } from 'mongoose';
import { ObjectId } from 'bson';

interface IEquiped {
  [index: string]: ObjectId;
}

export interface IActor extends Document {
  dbname: string,
  icon?: string,
  equiped: IEquiped
}