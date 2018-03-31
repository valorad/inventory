import { join, resolve } from 'path';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as send from 'koa-send';
import * as serve from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
import * as cors from "@koa/cors";

import { api } from './router';

import { ConfigLoader } from './util/config-loader';
import { DataBase } from "./database";

const app = new Koa();

let config = new ConfigLoader("inventory.json").config();

// handling config
if (config) {
  let port: number = config.koa.port || 3000;

  const router = new Router();

  const clientPath = join(__dirname, "../client");
  
  app.use(logger());
  app.use(bodyParser());
  app.use(serve(clientPath));
  
  // root route and sub route settings
  
  router.use('/api', api.routes(), api.allowedMethods())
  // router.get('/*', async (ctx) => {
  //   await send(ctx, join(clientPath, 'index.html'), { root: '/' });
  // });
  
  app.use(router.routes())
  .use(router.allowedMethods());
  
  new DataBase();

  // listen
  app.listen(port, () => {
    console.log(`** koa started on port ${port}. **`);
  });

} else {
  console.error("Invalid config detected, program shutting down");
  process.exit(-1);
}

export default app;