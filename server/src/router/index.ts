import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';

// sub routes
import { actor } from "./actor";
import { refItem } from "./ref-item";
import { baseItem } from "./base-item";
import { gear } from "./gear";
import { consumable } from "./consumable";
import { book } from "./book";
import { invItem } from "./inv-item";

// graph servers
import { actorServer } from "./actor";
import { baseItemServer } from "./base-item";
import { invItemServer } from "./inv-item";

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

    return this.routerInstance;

  }

  static get server() {
    let graphServers = [
      {
        name: "actors",
        server: actorServer,
      },
      {
        name: "baseItems",
        server: baseItemServer,
      },
      {
        name: "invItems",
        server: invItemServer,
      }
      
    ];

    return graphServers;
  }

}

export const api = API.router;
export const servers = API.server;