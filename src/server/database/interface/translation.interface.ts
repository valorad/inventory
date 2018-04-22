import { Document } from 'mongoose';

interface ILanguage {
  en: string,
  zh: string
}

export interface ITranslation extends Document {
  dbname: string,
  name: ILanguage,
  description: ILanguage
}