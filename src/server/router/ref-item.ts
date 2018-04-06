import * as Router from 'koa-router';
import { DeleteWriteOpResultObject } from 'mongodb';

import { Query } from "../util";
// import schemas
import { refItems } from '../database/schema/ref-items';


class RefItem {
  router = new Router();

  constructor() {

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        msg: "refItems works!"
      }
    });

    this.router.get('/all', async (ctx) => {
      let result = await Query.getList(refItems);
      ctx.body = result;
    });

    this.router.get('/owner/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await Query.getList(
        refItems,
        {
          conditions: {
            owner: dbname
          }
        }
      );
      ctx.body = result;
    });

    this.router.get('/item/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await Query.getList(
        refItems,
        {
          conditions: {
            item: dbname
          }
        }
      );
      ctx.body = result;
    });

    this.router.get('/id/:_id', async (ctx) => {
      let _id: string = ctx.params._id;

      let result = await Query.getDetail(refItems, {_id});
      if (result) {
        ctx.body = result;
      } else {
        ctx.body = [];
      }
      
    });

    this.router.post('/add', async (ctx) => {

      let newRefItem = await Query.addRecord(
        refItems,
        ctx.request.body,
        ["item", "owner"]
      );

      if (newRefItem) {
        ctx.body = {
          msg: `Successfully given ${newRefItem.owner} a new ${newRefItem.item} with id "${newRefItem._id}"`,
          status: 'success',
          id: newRefItem._id
        };
        return;
      } else {
        ctx.status = 500;
        ctx.body = {
          msg: `Failed to give ${ctx.request.body.owner} a new ${ctx.request.body.item}`,
          status: 'failure',
          id: null
        }
      }

    });

    this.router.delete('/delete/:_id', async (ctx) => {

      let token = {_id: ctx.params._id};
      let delResult: DeleteWriteOpResultObject["result"] = await Query.deleteRecord(refItems, token);

      if (delResult) {
        ctx.body = {
          msg: `Successfully deleted ref-item ${ctx.params._id}`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.status = 500;
        ctx.body = {
          msg: `Failed to delete ref-item ${ctx.params._id}`,
          status: 'failure',
          rmCount: 0
        }
      }

    });

  }

}

export const refItem = new RefItem().router;