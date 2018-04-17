import * as Router from 'koa-router';

import { ConsumableAction as Action } from "../action/consumable.action";

class Consumable {
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        message: "consumable works!"
      }
    });

    this.router.get('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getList({ dbname });
      ctx.body = result;
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


  }

}

export const consumable = new Consumable().router;