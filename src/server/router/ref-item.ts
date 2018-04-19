import * as Router from 'koa-router';

import { RefItemAction as Action } from "../action/ref-item.action";

class RefItem {
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        msg: "refItems works!"
      }
    });

    this.router.get('/all', async (ctx) => {
      let result = await this.action.getAll();
      ctx.body = result;
    });

    this.router.get('/owner/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getList({ owner: dbname });
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

    this.router.post('/add', async (ctx) => {

      let newRefItem = await this.action.add(ctx.request.body);

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

    this.router.patch('id/:_id', async (ctx) => {
      let _id: string = ctx.params._id;

      let updatedRefItems = await this.action.updateSingle(_id, ctx.request.body);
      if (updatedRefItems) {
        let updatedItem = updatedRefItems[0];
        ctx.body = {
          message: `Successfully updated ref-item ${updatedItem.dbname}`,
          status: "success",
          id: updatedItem._id
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to update ref-item ${_id}`,
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