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

export interface IActor {
  dbname: string,
  icon?: string,
  equiped?: any,
  name: string,
  biography: string
}

export interface INewActor {
  dbname: string,
  icon?: string,
  equiped?: any,
  translations?: {
    name?: {
      en?: string,
      zh?: string
    },
    biography?: {
      en?: string,
      zh?: string
    }
  }
}

interface equip {
  actorName: string
  invItemID: string
  equiptTo: string[]
}

interface unequip {
  actorName: string
  unequip: any
}

export interface IQuery {
  getList: (obj: any, args: {conditions?: string, page?: number, lang?: string}, context?: any, info?: any) => Promise<any[]>,
  getSingle: (obj: any, args: {dbname?: string, lang?: string}, context?: any, info?: any) => Promise<any>
}

export interface IMutation {
  add: (obj: any, args: {input: INewActor}, context?: any, info?: any) => Promise<IAddCallback>,
  delete: (obj: any, args: {conditions?: string}, context?: any, info?: any) => Promise<IDeleteCallback>
  equip: (obj: any, args: {input: equip}, context?: any, info?: any) => Promise<any>
  unequip: (obj: any, args: {input: unequip}, context?: any, info?: any) => Promise<any>
}