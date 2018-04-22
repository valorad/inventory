import { makeExecutableSchema } from 'graphql-tools'; 
import GraphQLJSON from 'graphql-type-json';

import { IMutation, IQuery } from "./type.interface";
import * as typeDefs from "./type.graphql";
import { Action } from "./action";


class BaseItemGraph {

  action = new Action();

  // fakeDB: any = {};

  types: any = typeDefs; // workaround for stupid typescript module
  // in fact, 'types' is of type 'DocumentNode'

  // data: any = {
  //   dbname: "item-t60_pa_chest",
  //   value: 2517,
  //   weight: 30.5,
  //   category: "gears",
  //   detail: {
  //     rating: 105,
  //     type: "type-powerarmor",
  //     equip: "body"
  //   }
  // }

  getList: IQuery["getList"] = async (obj, args) => {
    let conditions: any = {};

    if (args.conditions) {
      conditions = JSON.parse(args.conditions);
    }

    return await this.action.getList(conditions, args.page);

  };


  getSingle: IQuery["getSingle"] = async (obj, args) => {
    let dbname = args.dbname;
    if (dbname) {
      return await this.action.getSingle(dbname);
    }
    return {};
  };

  add: IMutation["add"] = async (obj, args) => {

    let input:any = args.input;
    let addResult = await this.action.add(input);
    let newBaseItem = addResult.newBaseItem;
    let newDetail = addResult.newDetail;
    if (newBaseItem) {
      if (newDetail) {
        return {
          message: `Successfully created new baseItem "${newBaseItem.dbname}" with id "${newBaseItem["_id"]}"`,
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
        message: `Failed to create new baseItem "${input.dbname}"`,
        status: 'failure',
        id: null
      };
    }

    // front-end request exmple:
    // mutation addItem($info: newBaseItem!) {
    //   add(input: $info) {
    //     message,
    //     status,
    //     id
    //   }
    // }

  };

  delete: IMutation["delete"] = async (obj, args) => {

    let conditions = args.conditions;
    let delResults = await this.action.delete(conditions);
    if (delResults) {
      if (delResults.detailDelResult) {
        if (delResults.baseDelResult) {
          return {
            message: `Successfully deleted selected baseItems`,
            status: 'success',
            rmCount: delResults.baseDelResult.n || 0
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
    } else {
      return {
        message: `Deletion failure: info mismatch`,
        status: 'failure',
        rmCount: 0
      };
    }
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

export const baseItemGraph = new BaseItemGraph().schema;