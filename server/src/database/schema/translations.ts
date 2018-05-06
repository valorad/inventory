import { model, Schema } from 'mongoose';

import { ITranslation } from "../interface/translation.interface";

const langDefault = {
  en: "",
  zh: ""
};

const schema = new Schema({
  dbname: {
    type: String,
    required: true
  },
  name: {
    type: {},
    default: langDefault
  },
  description: {
    type: {},
    default: langDefault
  }
});

export const translations = model<ITranslation>('translations', schema, "translations");