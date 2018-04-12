import { makeExecutableSchema } from 'graphql-tools'; 

import * as typeDefs from "./type.graphql";

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


  /**
   *
   * @param obj: The object that contains the result returned from the resolver on the parent field, or, in the case of a top-level Query field, the rootValue passed from the server configuration. This argument enables the nested nature of GraphQL queries.
   * @param args: An object with the arguments passed into the field in the query. For example, if the field was called with author(name: "Ada"), the args object would be: { "name": "Ada" }.
   * @param context: This is an object shared by all resolvers in a particular query, and is used to contain per-request state, including authentication information, dataloader instances, and anything else that should be taken into account when resolving the query. If you’re using Apollo Server, read about how to set the context in the setup documentation.
   * @param info: This argument should only be used in advanced cases, but it contains information about the execution state of the query, including the field name, path to the field from the root, and more. It’s only documented in the GraphQL.js source code.
   */
  add = (obj: any, args: any, context: any, info: any) => {

    // front-end request exmple:
    // mutation addItem($info: newBaseItem!) {
    //   add(input: $info) {
    //     dbname,
    //     value
    //   }
    // }

    // then args.input is what posted from front-end

    this.fakeDB = this.data;
    console.log(this.fakeDB);
    // return this.fakeDB;
    return {
      message: `Successfully created new baseItem "${this.fakeDB.dbname}" with id "9090980"`,
      status: 'success',
      id: "9090980"
    };
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