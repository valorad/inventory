
interface IInventoryItems {
  holder: string,
  item: {
    refid: string,
    owner: string,
    num: number,
    dbname: string,
    // item base info
    value: number,
    weight: number,
    category: string,
    // detail info
    content: string
  }
}


export class Action {
  getList = async () => {

    let inventoryItems: IInventoryItems[] = [];

    // output example:
    // [
      // {
      //   holder: "bayek",
      //   item: {
      //     refid: "chezsteakjms",
      //     owner: "bayek",
      //     num: 1,
      //     dbname: "item-book-dragonborn_return",
      //     // item base info
      //     value: 100,
      //     weight: 1,
      //     category: "books",
      //     // detail info
      //     content: "Six million double-u's went by but nobody every realized that the..."
      //   }
      // }
    // ]

    // get base info

    // according to item _id, fetch refitem everything

    // import actions from base-item graph and query base-item

    // extract result and get it extended to 'inventoryItems'

    // return

  };
}