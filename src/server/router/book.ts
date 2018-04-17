import * as Router from 'koa-router';

import { BookAction as Action } from "../action/book.action";

class Book {
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        message: "book works!"
      }
    });

    this.router.get('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let result = await this.action.getList({ dbname });
      ctx.body = result;
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


  }

}

export const book = new Book().router;