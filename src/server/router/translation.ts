import * as Router from 'koa-router';

import { TranslationAction as Action } from "../action/translation.action";

class Translation {
  router = new Router();
  action = new Action();

  constructor() {

    this.router.get('/', async (ctx) => {
      let result = await this.action.getAll();
      ctx.body = result;
    });

    this.router.get('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname;

      let result = await this.action.getSingle(dbname);
      if (result) {
        ctx.body = result[0] || {};
      } else {
        ctx.status = 500;
        ctx.body = {};
      }

    });

    this.router.post('/', async (ctx) => {

      let newTranslation = await this.action.add(ctx.request.body);

      if (newTranslation) {
        ctx.body = {
          message: `Successfully created new translation of "${newTranslation.dbname}" with id "${newTranslation._id}"`,
          status: 'success',
          id: newTranslation._id
        };
        return;
      } else {
        ctx.body = {
          message: `Failed to create translation of "${ctx.request.body.dbname}"`,
          status: 'failure',
          id: null
        }
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

      let updatedTranslations = await this.action.update(conditions, token);
      if (updatedTranslations) {
        ctx.body = {
          message: `Successfully updated selected translations`,
          status: "success",
          altCount: updatedTranslations.length
        }
      } else {
        ctx.status = 500;
        ctx.body = {
          message: `Failed to update selected translations`,
          status: "failure",
          altCount: 0
        }
      }

    });

    this.router.patch('/dbname/:dbname', async (ctx) => {
      let dbname: string = ctx.params.dbname || "";
      let updatedTranslations = await this.action.updateSingle(dbname, ctx.request.body);
      if (updatedTranslations) {
        let updatedTranslation = updatedTranslations[0];
        ctx.body = {
          message: `Successfully updated translation of ${updatedTranslation.dbname}`,
          status: "success",
          id: updatedTranslation._id
        };
        return;
      }

      ctx.body = {
        message: `Failed to update translation of ${dbname}`,
        status: "failure",
        id: null
      };


    });

    this.router.delete('/dbname/:dbname', async (ctx) => {

      let token = {dbname: ctx.params.dbname};
      let delResult = await this.action.delete(token);

      if (delResult) {
        ctx.body = {
          message: `Successfully deleted translation of ${ctx.params.dbname}`,
          status: 'success',
          rmCount: delResult.n
        };
        return;
      } else {
        ctx.status = 500;
        ctx.body = {
          message: `Failed to delete translation of ${ctx.params.dbname}`,
          status: 'failure',
          rmCount: 0
        }
      }

    });





  }
}