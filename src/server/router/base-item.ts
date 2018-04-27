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
      let result = await this.action.getAll();
      ctx.bodt = result;
    });

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

    // update list
    this.router.patch("/", async (ctx) => {
      let conditions: any;
      let token: any;
      if (ctx.request.body) {
        conditions = ctx.request.body.conditions;
        token = ctx.request.body.token;
      }

      let updatedBaseItems = await this.action.update(conditions, token);
      if (updatedBaseItems) {
        ctx.body = {
          message: `Successfully updated selected base-items`,
          status: "success",
          altCount: updatedBaseItems.length
        }
      } else {
        ctx.status = 500;
        ctx.body = {
          message: `Failed to update selected base-items`,
          status: "failure",
          altCount: 0
        }
      }

    });

    this.router.patch('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let updatedBaseItems = await this.action.updateSingle(dbname, ctx.request.body);
      if (updatedBaseItems) {
        let updatedItem = updatedBaseItems[0];
        ctx.body = {
          message: `Successfully updated base-item ${updatedItem.dbname}`,
          status: "success",
          id: updatedItem._id
        };
        return;
      }

      ctx.body = {
        message: `Failed to update base-item ${dbname}`,
        status: "failure",
        id: null
      };
    });

    this.router.post('/', async (ctx) => {

      let newBaseItem = await this.action.add(ctx.request.body);

      if (newBaseItem) {
        ctx.body = {
          message: `Successfully created new base-item "${newBaseItem.dbname}" with id "${newBaseItem._id}"`,
          status: 'success',
          id: newBaseItem._id
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to create base-item "${ctx.request.body.dbname}"`,
          status: 'failure',
          id: null
        }
      }

    });

    this.router.post('/graph', bodyParser(), graphqlKoa({ schema: schema }));

    this.router.delete('/dbname/:dbname', async (ctx) => {

      let token = {dbname: ctx.params.dbname};
      let delResult = await this.action.delete(token);

      if (delResult) {
        ctx.body = {
          message: `Successfully deleted base-item "${ctx.params.dbname}"`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to delete base-item "${ctx.params.dbname}"`,
          status: 'failure',
          rmCount: 0
        }
      }

    });

  }

}

export const baseItem = new BaseItem().router;