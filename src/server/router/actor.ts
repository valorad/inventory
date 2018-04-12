import * as Router from 'koa-router';

import { ActorAction as Action } from "../action/actor.action";

class Actor {
  
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        msg: "actor works!"
      }
    });

    this.router.get('/all', async (ctx) => {
      let result = this.action.getAll();
      ctx.body = result;
    });

    this.router.get('/name/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getSingle(dbname);
      ctx.body = result;
    });

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
        ctx.status = 500;
        ctx.body = {
          msg: `Failed to create actor "${ctx.request.body.dbname}"`,
          status: 'failure',
          id: null
        }
      }

    });

    this.router.delete('/delete/:name', async (ctx) => {

      let token = {dbname: ctx.params.name};
      let delResult = await this.action.delete(token);

      if (delResult) {
        ctx.body = {
          msg: `Successfully deleted actor "${ctx.params.name}"`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.status = 500;
        ctx.body = {
          msg: `Failed to delete actor "${ctx.params.name}"`,
          status: 'failure',
          rmCount: 0
        }
      }

    });

  }

}

export const actor = new Actor().router;