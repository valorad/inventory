

interface IGear {
  dbname?: string,
  rating: number,
  type: string,
  typeName: string,
  equip: string,
  equipI18n: ITranslatedEquip[],
  effects: string[]
  effectsI18n: ITranslatedEffect[],
}

interface IConsumable {
  dbname?: string,
  type: string,
  typeName: string,
  effects: string[]
}

interface IBook {
  dbname?: string,
  content: string,
  contentDetail: string
}

interface IAddCallback {
  message: string
  status: string
  id: string | null
}

interface IDeleteCallback {
  message: string
  status: string
  rmCount: number
}

interface INewGear {
  rating: number,
  type: string,
  equip: string[],
  effects: string[]
}

interface INewConsumable {
  type: string
  effects: string[]
}

interface INewBook {
  content: string
}

export interface ITranslatedEffect {
  effect: string,
  name: string
}

export interface ITranslatedEquip {
  equip: string,
  name: string
}

export interface IBaseItem {
  dbname: string,
  name: string,
  description: string,
  value: number,
  weight: number,
  category: string,
  detail: IGear | IConsumable | IBook
}

export interface INewBaseItem {
  dbname: string,
  value: number,
  weight: number,
  category: string,
  translations?: {
    name: {
      en?: string,
      zh?: string
    },
    description?: {
      en?: string,
      zh?: string
    },
    bookContent?: {
      en?: string,
      zh?: string
    }
  },
  detail: INewGear | INewConsumable | INewBook
}



export interface IQuery {
  getList: (obj: any, args: {conditions?: string, page?: number, lang?: string}, context?: any, info?: any) => Promise<any[]>,
  getSingle: (obj: any, args: {dbname?: string, lang?: string}, context?: any, info?: any) => Promise<any>
}

export interface IMutation {
  add: (obj: any, args: {input: INewBaseItem}, context?: any, info?: any) => Promise<IAddCallback>,
  delete: (obj: any, args: {conditions?: string}, context?: any, info?: any) => Promise<IDeleteCallback>
}

