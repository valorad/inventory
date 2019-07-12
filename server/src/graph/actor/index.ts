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
    let lang = args.lang || "en";

    if (args.conditions) {
      conditions = JSON.parse(args.conditions);
    }

    return await this.action.getList(conditions, args.page, lang);

  };

  getSingle: IQuery["getSingle"] = async (obj, args) => {
    let dbname = args.dbname;
    let lang = args.lang || "en";
    if (dbname) {
      return await this.action.getSingle(dbname, lang);
    }
    return {};
  };

  add: IMutation["add"] = async (obj, args) => {

    let input = args.input;
    let translations = input.translations;

    if (translations) {
      if (translations.name && (typeof translations.name === 'string')) {
        translations.name = JSON.parse(translations.name);
      }

      if (translations.biography && (typeof translations.biography === 'string')) {
        translations.biography = JSON.parse(translations.biography);
      }
    }

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
        status: 'failed',
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

  equip: IMutation["equip"] = async (obj, args) => {
    let actorName = args.input.actorName;
    let equiptTo = args.input.equiptTo;
    let invItemID = args.input.invItemID;
    return await this.action.equip(actorName, invItemID, equiptTo);
  };

  unequip: IMutation["unequip"] = async (obj, args) => {
    let actorName = args.input.actorName;
    let unequipSettings = args.input.unequip;
    return await this.action.unequip(actorName, unequipSettings);
  };

  resolvers = {
    Query: {
      actor: this.getSingle,
      actors: this.getList
    },
    Mutation: {
      add: this.add,
      delete: this.delete,
      equip: this.equip,
      unequip: this.unequip
    }
  }

  schema = makeExecutableSchema({typeDefs: this.types, resolvers: this.resolvers})

}

export const actorGraph = new ActorGraph().schema;