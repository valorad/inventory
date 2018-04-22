import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

// graphs
import { invItemGraph as schema } from "../graph/inventory";

// actions
import { InventoryAction as Action } from "../action/inventory.action";

class InventoryItem {
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/graph', graphqlKoa({ schema: schema }));
    this.router.get('/iql', graphiqlKoa({ endpointURL: '/api/invItem/graph' }));

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        message: "inventory works!"
      }
    });

    this.router.get('/all', async (ctx) => {
      let result = await this.action.getAll();
      ctx.body = result;
    });

    this.router.get('/holder/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getList({ holder: dbname });
      ctx.body = result;
    });

    this.router.get('/item/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getList({ item: dbname });
      ctx.body = result;
    });

    this.router.get('/id/:_id', async (ctx) => {
      let _id: string = ctx.params._id;

      let result = await this.action.getSingle(_id);
      if (result) {
        ctx.body = result;
      } else {
        ctx.body = [];
      }
      
    });

    this.router.post('/graph', bodyParser(), graphqlKoa({ schema: schema }));

    this.router.post('/add', async (ctx) => {

      let newInvItem = await this.action.add(ctx.request.body);

      if (newInvItem) {
        ctx.body = {
          message: `Successfully added ${newInvItem.item} with id "${newInvItem._id}" to ${newInvItem.holder}'s inventory `,
          status: 'success',
          id: newInvItem._id
        };
        return;
      } else {
        ctx.status = 500;
        ctx.body = {
          message: `Failed to add ${ctx.request.body.item} to ${ctx.request.body.holder}'s inventory `,
          status: 'failure',
          id: null
        }
      }

    });

    this.router.patch('id/:_id', async (ctx) => {
      let _id: string = ctx.params._id;

      let updatedInvItems = await this.action.updateSingle(_id, ctx.request.body);
      if (updatedInvItems) {
        let updatedItem = updatedInvItems[0];
        ctx.body = {
          message: `Successfully updated inv-item ${updatedItem.dbname}`,
          status: "success",
          id: updatedItem._id
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to update inv-item ${_id}`,
          status: "failure",
          id: _id
        };
      }
    });

    this.router.delete('/delete/:_id', async (ctx) => {

      let token = {_id: ctx.params._id};
      let delResult = await this.action.delete(token);

      if (delResult) {
        ctx.body = {
          msg: `Successfully deleted inv-item ${ctx.params._id}`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.status = 500;
        ctx.body = {
          msg: `Failed to delete inv-item ${ctx.params._id}`,
          status: 'failure',
          rmCount: 0
        }
      }

    });

  }

}

export const invItem = new InventoryItem().router;