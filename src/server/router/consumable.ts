import * as Router from 'koa-router';

import { ConsumableAction as Action } from "../action/consumable.action";

class Consumable {
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/', async (ctx) => {
      let result = await this.action.getAll();
      ctx.bodt = result;
    });

    this.router.get('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getList({ dbname });
      if (result) {
        ctx.body = result[0] || {};
      } else {
        ctx.status = 500;
        ctx.body = {};
      }
    });

    this.router.patch('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let updatedConsumables = await this.action.updateSingle(dbname, ctx.request.body);
      if (updatedConsumables) {
        let updatedConsumable = updatedConsumables[0];
        ctx.body = {
          message: `Successfully updated consumable ${updatedConsumable.dbname}`,
          status: "success",
          id: updatedConsumable._id
        };
        return;
      }

      ctx.body = {
        message: `Failed to update consumable ${dbname}`,
        status: "failure",
        id: null
      };

    });

    this.router.post('/', async (ctx) => {

      let newConsumable = await this.action.add(ctx.request.body);

      if (newConsumable) {
        ctx.body = {
          message: `Successfully created new consumable "${newConsumable.dbname}" with id "${newConsumable._id}"`,
          status: 'success',
          id: newConsumable._id
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to create consumable "${ctx.request.body.dbname}"`,
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
          message: `Successfully deleted consumable "${ctx.params.dbname}"`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to delete consumable "${ctx.params.dbname}"`,
          status: 'failure',
          rmCount: 0
        }
      }

    });




  }

}

export const consumable = new Consumable().router;