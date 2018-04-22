import { makeExecutableSchema } from 'graphql-tools'; 
import GraphQLJSON from 'graphql-type-json';

import { IMutation, IQuery } from "./type.interface";
import * as typeDefs from "./type.graphql";
import { Action } from "./action";

class ActorGraph {

  action = new Action();

  types: any = typeDefs;

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

    let input = args.input;
    let newActor = await this.action.add(input);
    if (newActor) {

      return {
        message: `Successfully created new actor "${newActor.dbname}" with id "${newActor["_id"]}"`,
        status: 'success',
        id: newActor["_id"]
      };
    } else {
      return {
        message: `Failed to create new actor "${input.dbname}"`,
        status: 'success',
        id: null
      };
    }
  };

  delete: IMutation["delete"] = async (obj, args) => {

    let conditions = args.conditions;
    let delResult = await this.action.delete(conditions);

    if (delResult) {
      return {
        message: "Succesfully deleted selected actors",
        status: "success",
        rmCount: delResult.n || 0
      }
    } else {
      return {
        message: "Failed to delete selected actors",
        status: "failure",
        rmCount: 0
      }
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

export const baseItemGraph = new ActorGraph().schema;