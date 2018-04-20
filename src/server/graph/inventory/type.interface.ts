interface IInvItem {
  item: string,
  holder: string
}

export interface IInventoryVerboseItem {
  holder: string,
  item: {
    refID?: string,
    owner: string,
    num: number,
    dbname: string,
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
}

export interface IQuery {
  getList: (obj: any, args: {conditions?: string, page?: number}, context?: any, info?: any) => Promise<any[]>,
  // getSingle: (obj: any, args: {dbname?: string}, context?: any, info?: any) => Promise<any[]>
}

export interface IMutation {
  gift: (obj: any, args: {refItemName: string, holder: string}, context?: any, info?: any) => Promise<IInvItem>,
  remove: (obj: any, args: {refItemName: string, holder: string}, context?: any, info?: any) => Promise<IInvItem>
}