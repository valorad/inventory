import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

// graphs
import { baseItemGraph as schema } from "../graph/base-item";

// actions
import { BaseItemAction as Action } from "../action/base-item.action";

class BaseItem {

  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/graph', graphqlKoa({ schema: schema }));
    this.router.get('/iql', graphiqlKoa({ endpointURL: '/api/baseItem/graph' }));

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        message: "base-item works!"
      }
    });

    this.router.get('/all', async (ctx) => {
      
    });



    this.router.post('/graph', bodyParser(), graphqlKoa({ schema: schema }));


  }

}

export const baseItem = new BaseItem().router;