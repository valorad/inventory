import { makeExecutableSchema } from 'graphql-tools'; 

import * as typeDefs from "./type.graphql";

class BaseItem {

  fakeDB = {};

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

  add = (obj, args, context, info) => {

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
    return this.data;
  };

  getSingle = (obj, args, context, info) => {

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