import { InventoryAction } from "../../action/inventory.action";
import { RefItemAction } from "../../action/ref-item.action";


interface IInventoryItems {
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

const invAction = new InventoryAction();
const refAction = new RefItemAction();

export class Action {
  getList = async (conditions: any, page?: number) => {

    let inventoryItems: IInventoryItems[] = [];

    // output example:
    // [
    //   {
    //     holder: "bayek",
    //     item: {
    //       refID: "chezsteakjms",
    //       owner: "bayek",
    //       num: 1,
    //       dbname: "item-book-dragonborn_return",
    //       // item base info
    //       base: {
    //         value: 100,
    //         weight: 1,
    //         category: "books",
    //         detail: {
    //         // detail info
    //         content: "Six million double-u's went by but nobody every realized that the..."
    //         }
    //       }
    //     }
    //   }
    // ]

    // get base info from inventories collection
    let minventories = await invAction.getList(conditions, page);

    // according to item _id, fetch refitem everything

    for (let inv of minventories) {
      let itemid = inv.item._id;
      let refItems = await refAction.getSingle(itemid);
      if (refItems) {
        inv.item = refItems[0];
      }

    }

    // import actions from base-item graph and query base-item

    // extract result and get it extended to 'inventoryItems'

    // return

  };
}