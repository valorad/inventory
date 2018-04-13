import { makeExecutableSchema } from 'graphql-tools'; 

import * as typeDefs from "./type.graphql";
import { IMutation } from "./type.interface";

// actions
import { BaseItemAction } from "../../action/base-item.action";
import { GearAction } from "../../action/gear.action";
import { ConsumableAction } from "../../action/consumable.action";
import { BookAction } from "../../action/book.action";

const baseItemAction = new BaseItemAction();

class BaseItem {

  fakeDB: any = {};

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
      let detailAction: any = null;

      switch (newBaseItem.category) {
        case 'gears':
          detailAction = new GearAction();
          break;
        case 'consumables':
          detailAction = new ConsumableAction();
          break;
        case 'books':
          detailAction = new BookAction();
          break;
        default: 
          break;
      }

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

  getSingle = (obj: any, args: any, context: any, info: any) => {

    let id = args.id;
    console.log(id);
    return this.data;

  };

  resolvers = {
    Query: {
      baseItem: this.getSingle
    },
    Mutation: {
      add: this.add
    }
  }
  
  get schema() {
    return makeExecutableSchema(
      {
        typeDefs: this.types,
        resolvers: this.resolvers
      }
    );

  }

}

export const baseItem = new BaseItem().schema;