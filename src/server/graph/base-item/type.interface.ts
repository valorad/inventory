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

interface IBaseItem {
  dbname: string
  value: number
  weight: number
  category: string
  detail: IGear | IConsumable | IBook
}

interface ICallback {
  message: string
  status: string
  id: string | null
}

export interface IMutation {
  add: (obj: any, args: {input: IBaseItem}, context?: any, info?: any) => Promise<ICallback>
}