import * as Router from 'koa-router';

import { View } from "../util";

// import schemas
import { actors } from '../database/schema/actors';


class Actor {
  router = new Router();

  constructor() {

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        msg: "actor works!"
      }
    });

    this.router.get('/all', async (ctx) => {
      let result = await View.getList(actors);
      ctx.body = result;
    });

    this.router.get('/name/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await View.getDetail(actors, {dbname});
      ctx.body = result;
    });

    this.router.post('/add', async (ctx) => {
      // let actorToSave = {};
      // let info = ctx.request.body;

      // actorToSave["dbname"] = info.dbname;
      // actorToSave["icon"] = info.icon;
      // actorToSave["equiped"] = info.equiped;

      // let newActor = new actors(actorToSave);

      // try {
      //   await newActor.save();
        // ctx.body = {
        //   msg: `Successfully created new actor ${newActor.dbname} with id ${newActor._id}`,
        //   status: 'success',
        //   id: newActor._id
        // }
      // } catch (error) {
      //   console.error(error);
      //   ctx.status = 500;
        // ctx.body = {
        //   msg: `Failed to create actor ${info.dbname}`,
        //   status: 'failure',
        //   id: null
        // }
      // }
      let newActor = await View.addRecord(actors, ctx.request.body, ["dbname", "icon", "equiped"]);

      if (newActor) {
        ctx.body = {
          msg: `Successfully created new actor ${newActor.dbname} with id ${newActor._id}`,
          status: 'success',
          id: newActor._id
        };
        return;
      } else {
        ctx.status = 500;
        ctx.body = {
          msg: `Failed to create actor ${ctx.request.body.dbname}`,
          status: 'failure',
          id: null
        }
      }

    });

  }

}

export const actor = new Actor().router;