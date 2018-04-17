import { makeExecutableSchema } from 'graphql-tools'; 
import GraphQLJSON from 'graphql-type-json';

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

  resolvers = {
    Query: {
      baseItem: this.action.getSingle,
      baseItems: this.action.getList
    },
    Mutation: {
      add: this.action.add,
      delete: this.action.delete
    }
  }

  schema = makeExecutableSchema({typeDefs: this.types, resolvers: this.resolvers})

}

export const baseItem = new BaseItem().schema;