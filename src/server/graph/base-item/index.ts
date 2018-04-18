import { makeExecutableSchema } from 'graphql-tools'; 
import GraphQLJSON from 'graphql-type-json';

import { IMutation, IQuery } from "./type.interface";
import * as typeDefs from "./type.graphql";
import { Action } from "./action";


class BaseItem {

  action = new Action();

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

  getList: IQuery["getList"] = async (obj, args) => {
    let conditions: any = {};

    if (args.conditions) {
      conditions = JSON.parse(args.conditions);
    }

    return await this.action.getList(conditions, args.page);

  };

  add: IMutation["add"] = async (obj, args) => {

    let input:any = args.input;
    return await this.action.add(input);

    // front-end request exmple:
    // mutation addItem($info: newBaseItem!) {
    //   add(input: $info) {
    //     message,
    //     status,
    //     id
    //   }
    // }

  };

  getSingle: IQuery["getSingle"] = async (obj, args) => {
    let dbname = args.dbname;
    if (dbname) {
      return await this.action.getSingle(dbname);
    }
    return [];
  };

  delete: IMutation["delete"] = async (obj, args) => {

    let conditions = args.conditions;
    let delResult = await this.action.delete(conditions);

    return delResult;
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