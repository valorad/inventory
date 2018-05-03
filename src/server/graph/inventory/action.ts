import { InvItemAction } from "../../action/inv-item.action";
import { RefItemAction } from "../../action/ref-item.action";
import { ActorAction } from "../../action/actor.action";
import { Action as BaseItemGraphAction } from "../base-item/action";
import { IInvVerboseItem, IRefItem, IInvItem } from "./type.interface";

const invAction = new InvItemAction();
const refAction = new RefItemAction();
const actorAction = new ActorAction();
const baseItemAction = new BaseItemGraphAction();

export class Action {
  getList = async (conditions: any, page?: number, lang = "en") => {

    let inventoryItems: IInvVerboseItem[] = [];

    // get base info from inventories collection
    let minventories: IInvItem[] = await invAction.getList(conditions, page);

    for (let inv of minventories) {
      let singleInv = {} as IInvVerboseItem;
      // etract single inv info
      singleInv = this.extractInfo(inv, invAction.fields) as IInvVerboseItem;

      // based on item dbname, fetch base info
      singleInv.base = await baseItemAction.getSingle(singleInv.item, lang);

      // according to refs array, fetch refitem everything
      let refDetails: IRefItem[] = [];
      for (let id of inv.refs) {
        let refItems = await refAction.getList({_id: id});
        if (refItems && refItems[0]) {
          let refItem: any = this.extractInfo(refItems[0], refAction.fields);
          refItem.refID = refItems[0]["_id"];
          refDetails.push(refItem);
        }

      }
      singleInv.refDetails = refDetails;

      inventoryItems.push(singleInv);
    }

    return inventoryItems;

  };

  getSingle = async (itemName: string, holder: string, lang = "en") => {
    let invVerboseItem = {} as IInvVerboseItem;
    let invItems: IInvItem[] = await invAction.getList({item: itemName, holder});

    if (invItems && invItems[0]) {
      invVerboseItem = this.extractInfo(invItems[0], invAction.fields) as IInvVerboseItem;
      invVerboseItem.base = await baseItemAction.getSingle(invVerboseItem.item, lang);

      // according to refs array, fetch refitem everything
      let refDetails: IRefItem[] = [];
      for (let id of invItems[0].refs) {
        let refItems = await refAction.getList({_id: id});
        if (refItems && refItems[0]) {
          let refItem: any = this.extractInfo(refItems[0], refAction.fields);
          refItem.refID = refItems[0]["_id"];
          refDetails.push(refItem);
        }

      }
      invVerboseItem.refDetails = refDetails;
    }

    return invVerboseItem;

  };

  /**
   * (Usually used by console or quest)
   * (Similar to player.additem in ElderScroll games console)
   * Gift the holder a new Item. The target actor is holding his own item.
   */
  gift = async (itemName: string, holder: string, num = 1) => {
    // create a ref item
    let newRefItem = await refAction.add({item: itemName, owner: holder, num: num});
    if (newRefItem) {
      // add that ref-item to inventory
      let existInvItem: IInvItem[] = await invAction.getList({item: itemName, holder: holder});
      if (existInvItem && existInvItem.length > 0) {
        // if has existing record, then push ref only

        existInvItem[0].refs.push(newRefItem["_id"]);



        // apply ref changes to database
        let updatedInv = await invAction.update(
          {_id: existInvItem[0]["_id"]},
          {refs: existInvItem[0].refs}
        );


        if (updatedInv) {
          return updatedInv[0]
        }

        return {} as IInvItem;

      } else {
        // record does not exist, then create a new one
        let newInvItem = await invAction.add({
          item: itemName,
          holder: holder,
          refs: [newRefItem["_id"]],
        });

        return newInvItem || {} as IInvItem;
      }
    }
    return {} as IInvItem;
  };

  /**
   * (Usually used by console or quest)
   * (Similar to player.removeitem in ElderScroll games console)
   * Delete Inv item from the world. 
   * Different from give(), exchange(), etc.
   */
  remove = async (itemName: string, holder: string, num = 1) => {

    let removeResult = {
      rmRefCount: 0,
      rmInvCount: 0,
      numToRemove: 0
    }

    let invItems: IInvItem[] = await invAction.getList({item: itemName, holder: holder});
    if (invItems && invItems[0]) {

      let refItems: any[] = [];
      let invItem = invItems[0];
      for (let id of invItem.refs) {
        let refItemsMatched = await refAction.getList({_id: id});
        if (refItemsMatched && refItemsMatched[0]) {
          refItems.push(refItemsMatched[0]);
        }
      }

      let totalNum = this.countTotalNum(refItems);

      let numToRemove = (num >= totalNum ? totalNum : num);

      // remove refitems by numToRemove
      let i = 0;

      while (numToRemove > 0) {
        // 够减才减法
        let refNum = refItems[i].num;

        if (refNum <= numToRemove) {
          // 不够减，执行清除
          let refDelResult = await refAction.delete({_id: refItems[i]["_id"]});

          if (refDelResult) {
            removeResult.rmRefCount += (refDelResult.n || 0);
          }
          // 清除冗余的invItem信息
          invItem.refs.splice(invItem.refs.indexOf(refItems[i]["_id"]), 1);
          // apply changes to database
          invAction.update({_id: invItems[0]["_id"]}, {refs: invItem.refs});

          if (invItem.refs.length <= 0) {
            // delete inv record if refs are all cleared out

            // unequip the item to delete
            if (await actorAction.isEquiping(holder, invItem["_id"])) {
              await actorAction.unequip(holder, invItem["_id"]);
            }

            // delete record
            let invDelResult = await invAction.delete({_id: invItem["_id"]});

            if (invDelResult) {
              removeResult.rmInvCount += (invDelResult.n || 0);
            }
          }

          numToRemove -= refNum;
        } else {
          // 够减，ref的num减少后numToRemove变为0,结束
          refItems[i].num -= numToRemove;
          // apply changes to database
          refAction.update(
            {_id: refItems[i]["_id"]},
            {num: refItems[i].num}
          )
          numToRemove = 0;
        }
        i++;
      }
    }
    return removeResult;
  };

  countTotalNum = (refItems: IRefItem[]) => {
    let totalNum = 0;
    for (let item of refItems) {
      let num = item.num || 0;
      totalNum += num;
    }
    return totalNum;
  };

  extractInfo = (qResultItem: any, fields: string[]) => {
    let ext = {};
    for (let key of fields) {
      ext[key] = qResultItem[key];
    }
    return ext;
  };

}