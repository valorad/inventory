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
import { invItem } from "./inventory";

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
    this.routerInstance.use('/actor', actor.routes(), actor.allowedMethods());
    this.routerInstance.use('/refItem', refItem.routes(), refItem.allowedMethods());
    this.routerInstance.use('/baseItem', baseItem.routes(), baseItem.allowedMethods());
    this.routerInstance.use('/gear', gear.routes(), gear.allowedMethods());
    this.routerInstance.use('/consumable', consumable.routes(), consumable.allowedMethods());
    this.routerInstance.use('/book', book.routes(), book.allowedMethods());
    this.routerInstance.use('/invItem', invItem.routes(), invItem.allowedMethods());


    // this.routerInstance.get('/graphql', graphqlKoa({ schema: schema }));
    // this.routerInstance.get('/graphiql', graphiqlKoa({ endpointURL: '/api/graphql' }));
    
    // this.routerInstance.post('/graphql', bodyParser(), graphqlKoa({ schema: schema }));

    return this.routerInstance;

  }
}

export const api = API.router;