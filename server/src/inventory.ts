import { join, resolve } from 'path';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';

import * as serve from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
import * as cors from "@koa/cors";

import { api } from './router';
import { servers } from './router';

import { ConfigLoader } from './util';
import { DataBase } from "./database";

const app = new Koa();

let config = new ConfigLoader("inventory.json").config();

// handling config
if (config) {
  let port: number = config.koa.port || 3000;

  const router = new Router();

  const clientPath = join(__dirname, "./static/client");
  
  app.use(logger());
  app.use(cors());
  app.use(bodyParser());
  app.use(serve(clientPath));
  
  // root route and sub route settings
  
  router.use('/api', api.routes(), api.allowedMethods())
  
  app.use(router.routes())
  .use(router.allowedMethods());
  
  const db = new DataBase();
  db.connect();

  // bind graphqls
  for (let server of servers) {

    server.server.applyMiddleware({
      app: app,
      path: `/api/${server.name}/graph`
    })

  }

  // listen
  app.listen(port, () => {
    console.log(`** koa started on port ${port}. **`);
  });

} else {
  console.error("Invalid config detected, program shutting down");
  process.exit(-1);
}

export default app;