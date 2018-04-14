import { makeExecutableSchema } from 'graphql-tools'; 
import GraphQLJSON from 'graphql-type-json';

import * as typeDefs from "./type.graphql";
import { IMutation, IQuery } from "./type.interface";

// actions
import { BaseItemAction } from "../../action/base-item.action";
import { GearAction } from "../../action/gear.action";
import { ConsumableAction } from "../../action/consumable.action";
import { BookAction } from "../../action/book.action";

const baseItemAction = new BaseItemAction();

class BaseItem {

  // fakeDB: any = {};

  types: any = typeDefs; // workaround for stupid typescript module
  // in fact, 'types' is of type 'DocumentNode'

  data: any = {
    dbname: "item-t60_pa_chest",
    value: 2517,
    weight: 30.5,
    category: "gears",
    detail: {
      rating: 105,
      type: "type-powerarmor",
      equip: "body"
    }
  }


  add: IMutation["add"] = async (obj, args) => {
    
    // front-end request exmple:
    // mutation addItem($info: newBaseItem!) {
    //   add(input: $info) {
    //     message,
    //     status,
    //     id
    //   }
    // }

    // then args.input is what posted from front-end

    // insert into baseItems collection
    
    let newBaseItem = await baseItemAction.add(args.input);

    if (newBaseItem) {
      // according to "category", insert detail info to corresponing col.
      let detailAction = this.selectAction(newBaseItem.category)

      if (detailAction) {

        let newDetail = await detailAction.add({
          dbname: newBaseItem.dbname,
          ...args.input.detail
        });

        if (newDetail) {
          return {
            message: `Successfully created new baseItem "${newBaseItem.dbname}" with id "${newBaseItem._id}"`,
            status: 'success',
            id: newBaseItem._id
          };
        } else {
          return {
            message: `Failed to asign detail to baseItem "${args.input.dbname}"`,
            status: 'failure',
            id: newBaseItem._id
          };
        }

      } else {
        return {
          message: `Failed to find appropriate action when trying to create new baseItem "${newBaseItem.dbname}"`,
          status: 'failure',
          id: newBaseItem._id
        };
      }

    } else {
      return {
        message: `Failed to create new baseItem "${args.input.dbname}"`,
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

  getList: IQuery["getList"] = async (obj, args) => {

    let conditions: any = {};

    if (args.conditions) {
      conditions = JSON.parse(args.conditions);
    }

    let metBaseItems = await baseItemAction.getList({}, args.page);
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

  getSingle: IQuery["getSingle"] = async (obj: any, args: any, context: any, info: any) => {

    let baseItem: any = {};
    let metBaseItems = await baseItemAction.getSingle(args.dbname);

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

  delete: IMutation["delete"] = async (obj: any, args: any, context: any, info: any) => {
    
    let conditions: any = {};
    let matchInfo: any[] = [];

    if (args.conditions) {
      conditions = JSON.parse(args.conditions);
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

  resolvers = {
    Query: {
      baseItem: this.getSingle,
      baseItems: this.getList
    },
    Mutation: {
      add: this.add,
      delete: this.delete
    }
  }

  schema = makeExecutableSchema({typeDefs: this.types, resolvers: this.resolvers})

}

export const baseItem = new BaseItem().schema;