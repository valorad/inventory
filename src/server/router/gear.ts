import * as Router from 'koa-router';

import { GearAction as Action } from "../action/gear.action";

class Gear {
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        message: "gear works!"
      }
    });

    this.router.get('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getList({ dbname });
      ctx.body = result;
    });

    this.router.patch('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let updatedGears = await this.action.updateSingle(dbname, ctx.request.body);
      if (updatedGears) {
        let updatedGear = updatedGears[0];
        ctx.body = {
          message: `Successfully updated gear ${updatedGear.dbname}`,
          status: "success",
          id: updatedGear._id
        };
        return;
      }

      ctx.body = {
        message: `Failed to update gear ${dbname}`,
        status: "failure",
        id: null
      };


    });


  }

}

export const gear = new Gear().router;