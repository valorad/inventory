import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

// graphs
import { actorGraph as schema } from "../graph/actor";

// actions
import { ActorAction as Action } from "../action/actor.action";

class Actor {
  
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/graph', graphqlKoa({ schema: schema }));
    this.router.get('/iql', graphiqlKoa({ endpointURL: '/api/actor/graph' }));

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        message: "actor works!"
      }
    });

    this.router.get('/all', async (ctx) => {
      let result = await this.action.getAll();
      ctx.body = result;
    });

    this.router.get('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getSingle(dbname);
      ctx.body = result;
    });

    this.router.post('/graph', bodyParser(), graphqlKoa({ schema: schema }));

    this.router.post('/add', async (ctx) => {

      let newActor = await this.action.add(ctx.request.body);

      if (newActor) {
        ctx.body = {
          message: `Successfully created new actor "${newActor.dbname}" with id "${newActor._id}"`,
          status: 'success',
          id: newActor._id
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to create actor "${ctx.request.body.dbname}"`,
          status: 'failure',
          id: null
        }
      }

    });

    this.router.delete('/dbname/:dbname', async (ctx) => {

      let token = {dbname: ctx.params.dbname};
      let delResult = await this.action.delete(token);

      if (delResult) {
        ctx.body = {
          message: `Successfully deleted actor "${ctx.params.dbname}"`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to delete actor "${ctx.params.dbname}"`,
          status: 'failure',
          rmCount: 0
        }
      }

    });

  }

}

export const actor = new Actor().router;