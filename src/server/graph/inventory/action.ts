import { InventoryAction } from "../../action/inventory.action";
import { RefItemAction } from "../../action/ref-item.action";
import { ActorAction } from "../../action/actor.action";
import { Action as BaseItemGraphAction } from "../base-item/action";

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
const actorAction = new ActorAction();

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
    //           // detail info
    //           content: "Six million double-u's went by but nobody every realized that the..."
    //         }
    //       }
    //     }
    //   }
    // ]

    // get base info from inventories collection
    let minventories = await invAction.getList(conditions, page);

    

    for (let inv of minventories) {
      let singleInv: any = {};
      // etract single inv info
      singleInv = this.extractInfo(inv, invAction.fields);

      // according to item _id, fetch refitem everything

      let refid = inv.item;

      let refItems = await refAction.getSingle(refid);

      if (refItems && refItems[0]) {
        // extract refitem info
        
        let refItem: any = this.extractInfo(refItems[0], refAction.fields);

        // assign every key accordingly
        singleInv.item = {};
        singleInv.item.refID = refid;
        singleInv.item.owner = refItem.owner;
        singleInv.item.dbname = refItem.dbname;
        singleInv.item.base = {};

        // import actions from base-item graph and query base-item
        // extract result and get it extended to 'inventoryItems'
        const baseItemAction = new BaseItemGraphAction();
        singleInv.item.base = await baseItemAction.getSingle(refItem.item);


      }

      inventoryItems.push(singleInv);

    }

    return inventoryItems;

  };

  /**
   * (Usually used by console or quest)
   * (Similar to player.removeitem in ElderScroll games console)
   * (But can only remove all)
   * Delete Inv item from the world. 
   * Different from give(), exchange(), etc.
   */
  remove = async (refItemName: string, holder: string) => {

    let refItems = await refAction.getList({item: refItemName});
    if (refItems && refItems[0]) {
      let refItem = refItems[0];
      let invItems = await invAction.getList({item: refItem._id, holder: holder});
      if (invItems) {
        let invItem = invItems[0];
        // unequip the item to delete
        if (actorAction.isEquiping(holder, invItem._id)) {
          actorAction.unequip(holder, invItem._id);
        }
        // delete inv-item
        invAction.delete({_id: invItem._id});
        // delete ref-item
        refAction.delete({_id: refItem._id});
        return invItem;

      }
      return null;
    }
    return null;
  };

  /**
   * (Usually used by console or quest)
   * (Similar to player.additem in ElderScroll games console)
   * Gift the holder a new Item. The target actor is holding his own item.
   */
  gift = async (item: string, holder: string) => {
    // create a ref item
    let newRefItem = await refAction.add({item, owner: holder});
    if (newRefItem) {
      // add that ref-item to inventory
      let newInvItem = await invAction.add({item: newRefItem._id, holder});
      return newInvItem;
    }
    return null;
  };

  extractInfo = (qResultItem: any, fields) => {
    let ext = {};
    for (let key of fields) {
      ext[key] = qResultItem[key];
    }
    return ext;
  };

}