import { model, Schema } from 'mongoose';

import { IBook } from "../interface/book.interface";

const schema = new Schema({
  dbname: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  }
});

export const books = model<IBook>('books', schema, "books");