import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';

// graphs
import { actorGraph as schema } from "../graph/actor";

// actions
import { ActorAction as Action } from "../action/actor.action";

class Actor {
  
  router = new Router();
  action = new Action();
  server = new ApolloServer({
    schema: schema
  });

  constructor() {

    this.router.get('/', async (ctx) => {
      let result = await this.action.getAll();
      ctx.body = result;
    });

    // this.router.get('/graph', graphqlKoa({ schema: schema }));
    // this.router.get('/iql', graphiqlKoa({ endpointURL: '/api/actors/graph' }));

    this.router.get('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getSingle(dbname);
      if (result) {
        ctx.body = result[0] || {};
      } else {
        ctx.status = 500;
        ctx.body = {};
      }
      
    });

    // this.router.post('/graph', bodyParser(), graphqlKoa({ schema: schema }));

    // atomic add
    this.router.post('/', async (ctx) => {

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

    // update list
    this.router.patch("/", async (ctx) => {
      let conditions: any;
      let token: any;
      if (ctx.request.body) {
        conditions = ctx.request.body.conditions;
        token = ctx.request.body.token;
      }

      let updatedActors = await this.action.update(conditions, token);
      if (updatedActors) {
        ctx.body = {
          message: `Successfully updated selected actors`,
          status: "success",
          altCount: updatedActors.length
        }
      } else {
        ctx.status = 500;
        ctx.body = {
          message: `Failed to update selected actors`,
          status: "failure",
          altCount: 0
        }
      }

    });

    this.router.patch('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let updatedActors = await this.action.updateSingle(dbname, ctx.request.body);
      if (updatedActors) {
        let updatedActor = updatedActors[0];
        ctx.body = {
          message: `Successfully updated ${updatedActor.dbname}`,
          status: "success",
          id: updatedActor._id
        };
        return;
      }

      ctx.body = {
        message: `Failed to update ${dbname}`,
        status: "failure",
        id: null
      };
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

    this.server.applyMiddleware({
      app: this.router
    });
  }

}

export const actor = new Actor().router;