import * as Router from 'koa-router';
import { DeleteWriteOpResultObject, ObjectId } from 'mongodb';

import { Query } from "../util";
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
      let result = await Query.getList(actors);
      ctx.body = result;
    });

    this.router.get('/name/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await Query.getDetail(actors, {dbname});
      ctx.body = result;
    });

    this.router.post('/add', async (ctx) => {

      let newActor = await Query.addRecord(
        actors,
        ctx.request.body,
        ["dbname", "icon", "equiped"],
        (actorToSave: any) => {

          if (!actorToSave.equiped) {
            actorToSave.equiped = {};
          }

          for (let key in actorToSave.equiped) {

            if (typeof actorToSave.equiped[key] === 'string') {

              try {

                actorToSave.equiped[key] = new ObjectId(actorToSave.equiped[key]);
  
              } catch (error) {
                console.error(`Error: ObjectID Conversion Failure at ${actorToSave.dbname}'s equiped ${key}: ${error.message}`);
                actorToSave.equiped[key] = null;
              }
              
            } else if (!(actorToSave.equiped[key] instanceof ObjectId)) {
              actorToSave.equiped[key] = null;
            }

          } // <- for

        }

      );

      if (newActor) {
        ctx.body = {
          msg: `Successfully created new actor "${newActor.dbname}" with id "${newActor._id}"`,
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
      let delResult: DeleteWriteOpResultObject["result"] = await Query.deleteRecord(actors, token);

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