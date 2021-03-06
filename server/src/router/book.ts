import * as Router from 'koa-router';

import { BookAction as Action } from "../action/book.action";

class Book {
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/', async (ctx) => {
      let result = await this.action.getAll();
      ctx.body = result;
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

      let updatedBooks = await this.action.update(conditions, token);
      if (updatedBooks) {
        ctx.body = {
          message: `Successfully updated selected books`,
          status: "success",
          altCount: updatedBooks.length
        }
      } else {
        ctx.status = 500;
        ctx.body = {
          message: `Failed to update selected books`,
          status: "failure",
          altCount: 0
        }
      }

    });

    this.router.patch('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let updatedBooks = await this.action.updateSingle(dbname, ctx.request.body);
      if (updatedBooks) {
        let updatedBook = updatedBooks[0];
        ctx.body = {
          message: `Successfully updated book ${updatedBook.dbname}`,
          status: "success",
          id: updatedBook._id
        };
        return;
      }

      ctx.body = {
        message: `Failed to update book ${dbname}`,
        status: "failure",
        id: null
      };

    });

    this.router.post('/', async (ctx) => {

      let newBook = await this.action.add(ctx.request.body);

      if (newBook) {
        ctx.body = {
          message: `Successfully created new book "${newBook.dbname}" with id "${newBook._id}"`,
          status: 'success',
          id: newBook._id
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to create book "${ctx.request.body.dbname}"`,
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
          message: `Successfully deleted book "${ctx.params.dbname}"`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to delete book "${ctx.params.dbname}"`,
          status: 'failure',
          rmCount: 0
        }
      }

    });



  }

}

export const book = new Book().router;