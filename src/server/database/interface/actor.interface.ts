import { Document } from 'mongoose';
import { ObjectId } from 'bson';

export interface IEquiped {
  head?: ObjectId,
  face?: ObjectId,
  neck?: ObjectId,
  body?: ObjectId,
  back?: ObjectId,
  forearms?: ObjectId,
  lefthand?: ObjectId,
  righthand?: ObjectId,
  bothhands?: ObjectId,
  finger?: ObjectId,
  feet?: ObjectId
}

export interface IActor extends Document {
  dbname: string,
  icon?: string,
  equiped?: IEquiped
}