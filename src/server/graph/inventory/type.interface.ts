import { ObjectId } from "bson";

export interface IInvItem {
  item: string,
  holder: string,
  refs: ObjectId[]
}

export interface IRefItem {
  item: string,
  owner: string,
  num: number
}

export interface IRefItem {
  refID?: string,
  owner: string,
  num: number,
  dbname: string
}

export interface IInvVerboseItem {
  holder: string,
  item: string,
  refs: ObjectId[],
  refDetails: IRefItem[]
  // item base info
  base?: {
    baseID?: string,
    value: number,
    weight: number,
    category: string,
    detail?: {
      // gear + comsumable
      rating?: number
      type?: string
      equip?: string
      effects?: string[]
      // book
      content?: string
    }
  }
}

interface IRMResult {
  rmRefCount: number,
  rmInvCount: number
}

export interface IQuery {
  getList: (obj: any, args: {conditions?: string, page?: number, lang?: string}, context?: any, info?: any) => Promise<IInvVerboseItem[]>,
  // getSingle: (obj: any, args: {dbname?: string}, context?: any, info?: any) => Promise<any[]>
}

export interface IMutation {
  gift: (obj: any, args: {itemName: string, holder: string}, context?: any, info?: any) => Promise<IInvItem>,
  remove: (obj: any, args: {itemName: string, holder: string}, context?: any, info?: any) => Promise<IRMResult>
}