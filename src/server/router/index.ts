import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

// sub routes
import { actor } from "./actor";
import { refItem } from "./ref-item";
import { baseItem } from "./base-item";
import { gear } from "./gear";
import { consumable } from "./consumable";
import { book } from "./book";
import { invItem } from "./inv-item";

class API {

  static routerInstance = new Router();

  static get router(): Router {
    
    /* GET api listing. */
    this.routerInstance.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        message: "api works!"
      }
    });

    // sub routes
    this.routerInstance.use('/actors', actor.routes(), actor.allowedMethods());
    this.routerInstance.use('/refItems', refItem.routes(), refItem.allowedMethods());
    this.routerInstance.use('/baseItems', baseItem.routes(), baseItem.allowedMethods());
    this.routerInstance.use('/gears', gear.routes(), gear.allowedMethods());
    this.routerInstance.use('/consumables', consumable.routes(), consumable.allowedMethods());
    this.routerInstance.use('/books', book.routes(), book.allowedMethods());
    this.routerInstance.use('/invItems', invItem.routes(), invItem.allowedMethods());


    // this.routerInstance.get('/graphql', graphqlKoa({ schema: schema }));
    // this.routerInstance.get('/graphiql', graphiqlKoa({ endpointURL: '/api/graphql' }));
    
    // this.routerInstance.post('/graphql', bodyParser(), graphqlKoa({ schema: schema }));

    return this.routerInstance;

  }
}

export const api = API.router;