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
      let ext = {};
      for (let key of baseItemAction.fileds) {

        ext[key] = item[key];
      }

      extractedItems.push(ext);
    }

    // attach details
    for (let item of extractedItems) {

      let detailAction = this.selectAction(item.category);

      if (detailAction) {

        let rawDetail = await detailAction.getSingle(item.dbname);

        if (rawDetail && rawDetail.length > 0) {
          let detail = rawDetail[0];
          item.detail = detail;

        } else {
          item.detail = {};
        }

      }
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

  getSingle = (obj: any, args: any, context: any, info: any) => {

    // let dbanme = args.dbanme;
    // console.log(id);
    return this.data;

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

  resolvers = {
    Query: {
      baseItem: this.getSingle,
      baseItems: this.getList
    },
    Mutation: {
      add: this.add
    }
  }


  
  // get schema() {
  //   return makeExecutableSchema(
  //     {
  //       typeDefs: this.types,
  //       resolvers: this.resolvers
  //     }
  //   );

  // }

  // Object.assign(schema._typeMap.JSON, {
  //   name: 'JSON',
  //   serialize: GraphQLJSON.serialize,
  //   parseValue: GraphQLJSON.parseValue,
  //   parseLiteral: GraphQLJSON.parseLiteral
  // })

  schema = makeExecutableSchema({typeDefs: this.types, resolvers: this.resolvers})

}

export const baseItem = new BaseItem().schema;