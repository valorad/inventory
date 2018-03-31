import { join, resolve } from 'path';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as send from 'koa-send';
import * as serve from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
import * as cors from "@koa/cors";

import { api } from './router/api';

const app = new Koa();
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

// listen
app.listen(3000, () => {
  console.log("** koa started on port 3000. **");
});

export default app;