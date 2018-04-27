import * as Router from 'koa-router';

import { GearAction as Action } from "../action/gear.action";

class Gear {
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

    // update list
    this.router.patch("/", async (ctx) => {
      let conditions: any;
      let token: any;
      if (ctx.request.body) {
        conditions = ctx.request.body.conditions;
        token = ctx.request.body.token;
      }

      let updatedGears = await this.action.update(conditions, token);
      if (updatedGears) {
        ctx.body = {
          message: `Successfully updated selected gears`,
          status: "success",
          altCount: updatedGears.length
        }
      } else {
        ctx.status = 500;
        ctx.body = {
          message: `Failed to update selected gears`,
          status: "failure",
          altCount: 0
        }
      }

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

    this.router.post('/', async (ctx) => {

      let newGear = await this.action.add(ctx.request.body);

      if (newGear) {
        ctx.body = {
          message: `Successfully created new gear "${newGear.dbname}" with id "${newGear._id}"`,
          status: 'success',
          id: newGear._id
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to create gear "${ctx.request.body.dbname}"`,
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
          message: `Successfully deleted gear "${ctx.params.dbname}"`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to delete gear "${ctx.params.dbname}"`,
          status: 'failure',
          rmCount: 0
        }
      }

    });



  }

}

export const gear = new Gear().router;