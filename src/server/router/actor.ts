import * as Router from 'koa-router';

// import schemas
import { actors } from '../database/schema/actors';

import { View } from "../util";

// class Actor {

//   static routerInstance = new Router();

//   static get router(): Router {
    
//     /* GET api listing. */
    // this.routerInstance.get('/', async (ctx) => {
    //   ctx.status = 200;
    //   ctx.body = {
    //     msg: "actor works!"
    //   }
    // });

//     this.routerInstance.get('/all', async (ctx) => {
//       let metActors = await actors.find();
//       ctx.body = metActors;
//     });

//     return this.routerInstance;

//   }
// }

// export const actor = Actor.router;

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

  }

}

export const actor = new Actor().router;