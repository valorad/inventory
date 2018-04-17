interface IGear {
  rating: number
  type: string
  equip: string
  effects: string[]
}

interface IConsumable {
  type: string
  effects: string[]
}

interface IBook {
  content: string
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

export interface IBaseItem {
  dbname: string
  value: number
  weight: number
  category: string
  detail: IGear | IConsumable | IBook
}

export interface IQuery {
  getList: (obj: any, args: {conditions?: string, page?: number}, context?: any, info?: any) => Promise<any[]>,
  getSingle: (obj: any, args: {dbname?: string}, context?: any, info?: any) => Promise<any[]>
}

export interface IMutation {
  add: (obj: any, args: {input: IBaseItem}, context?: any, info?: any) => Promise<IAddCallback>,
  delete: (obj: any, args: {conditions?: string}, context?: any, info?: any) => Promise<IDeleteCallback>
}
