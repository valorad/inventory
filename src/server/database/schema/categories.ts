import { model, Schema } from 'mongoose';

import { ICategory } from "../interface/category.interface";

const schema = new Schema({
  dbname: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

export const categories = model<ICategory>('categories', schema, "categories");