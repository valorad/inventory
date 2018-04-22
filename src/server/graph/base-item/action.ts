import { IBaseItem, INewBaseItem } from "./type.interface";

// actions
import { BaseItemAction } from "../../action/base-item.action";
import { GearAction } from "../../action/gear.action";
import { ConsumableAction } from "../../action/consumable.action";
import { BookAction } from "../../action/book.action";

const baseItemAction = new BaseItemAction();

export class Action {

  add = async (input: INewBaseItem, lang: string = "en") => {
    
    // insert into baseItems collection
    
    let newBaseItem: INewBaseItem = await baseItemAction.add(input);

    if (newBaseItem) {
      // according to "category", insert detail info to corresponing col.
      let detailAction = this.selectAction(newBaseItem.category)

      if (detailAction) {

        let newDetail = await detailAction.add({
          dbname: newBaseItem.dbname,
          ...input.detail
        });

        if (newDetail) {

          // books need to add translations
          if (newBaseItem.category === "books") {

          }

          return {
            message: `Successfully created new baseItem "${newBaseItem.dbname}" with id "${newBaseItem._id}"`,
            status: 'success',
            id: newBaseItem["_id"]
          };
        } else {
          return {
            message: `Failed to asign detail to baseItem "${input.dbname}"`,
            status: 'failure',
            id: newBaseItem["_id"]
          };
        }

      } else {
        return {
          message: `Failed to find appropriate action when trying to create new baseItem "${newBaseItem.dbname}"`,
          status: 'failure',
          id: newBaseItem["_id"]
        };
      }

    } else {
      return {
        message: `Failed to create new baseItem "${input.dbname}"`,
        status: 'failure',
        id: null
      };
    }

    // Then front-end will receive: 
    // {
    //   "data": {
    //     "add": {
    //       "message": "Successfully created new baseItem \"item-t60_pa_chest\" with id \"9090980\"",
    //       "status": "success",
    //       "id": "9090980"
    //     }
    //   }
    // }



  };

  getList = async (conditions = {}, page?) => {

    let metBaseItems = await baseItemAction.getList(conditions, page);
    let extractedItems: any[] = [];

    // extract needed info from mongoose query result
    for (let item of metBaseItems) {

      let ext = this.extractInfo(item);
      extractedItems.push(ext);
    }

    // attach details
    for (let item of extractedItems) {
      item.detail = await this.attachDetail(item);
    }
    return extractedItems;

    // e.g. front-end request
    // query getItemList($conditions: JSON, $page: Int) {
  
    //   baseItems: baseItems(conditions: $conditions, page: $page) {
    //     dbname,
    //     value,
    //     weight,
    //     category,
    //     detail
    //   }
    
    // }

    // ----- params -----

    // {
    //   "page": 1
    // }

  };

  getSingle = async (dbname: string) => {

    let baseItem: any = {};
    let metBaseItems = await baseItemAction.getSingle(dbname);

    if (metBaseItems) {
      // extract needed info from mongoose query result
      let rawItem = metBaseItems[0];
      baseItem = this.extractInfo(rawItem);

      // attach details
      baseItem.detail = await this.attachDetail(rawItem);
    }

    return baseItem;


    // e.g. front-end request
    // query getItem($dbname: String) {
    //   baseItems: baseItem(dbname: $dbname) {
    //     dbname
    //     value
    //     weight
    //     category
    //     detail
    //   }
    // }

    // ----- params -----

    // {
    //   "dbname": "item-t60_pa_chest-t5"
    // }


  };

  delete = async (conditions: any) => {
    
    let matchInfo: any[] = [];

    if (conditions && (typeof conditions === 'string')) {
      conditions = JSON.parse(conditions);
    }

    let metBaseItems = await baseItemAction.getList(conditions);
    for (let item of metBaseItems) {
      // store matched item dbname and category
      matchInfo.push(
        {
          dbname: item.dbname,
          category: item.category
        }
      );

    }

    // delete details
    for (let item of matchInfo) {
      let action = this.selectAction(item.category);
      let detailDelResult = await action.delete({dbname: item.dbname});
      if (detailDelResult) {
        // delete base
        let baseDelResult = await baseItemAction.delete(conditions);
        if (baseDelResult) {
          return {
            message: `Successfully deleted selected baseItems`,
            status: 'success',
            rmCount: baseDelResult.n || 0
          };
        } else {
          return {
            message: `Deletion failure: base info`,
            status: 'failure',
            rmCount: 0
          };
        }
      } else {
        return {
          message: `Deletion failure: details`,
          status: 'failure',
          rmCount: 0
        };
      }

    }

    return {
      message: `Deletion failure: info mismatch`,
      status: 'failure',
      rmCount: 0
    };

  };

  selectAction = (category: string) => {
    let action: any = null;

    switch (category) {
      case 'gears':
      action = new GearAction();
        break;
      case 'consumables':
      action = new ConsumableAction();
        break;
      case 'books':
      action = new BookAction();
        break;
      default: 
        break;
    }
    return action;
  };

  extractInfo = (qResultItem: any) => {
    let ext = {};
    for (let key of baseItemAction.fileds) {
      ext[key] = qResultItem[key];
    }
    return ext;
  };

  attachDetail = async (baseItem: any) => {
    let detail: any = {};
    let detailAction = this.selectAction(baseItem.category);
    if (detailAction) {

      let rawDetail = await detailAction.getSingle(baseItem.dbname);

      if (rawDetail && rawDetail.length > 0) {
        detail = rawDetail[0];
      }

    }
    return detail;
  };




}